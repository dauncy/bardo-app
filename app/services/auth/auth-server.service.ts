import { singleton, inject } from 'tsyringe'
import type { App } from 'firebase-admin/app'
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import type { Auth } from 'firebase-admin/auth'
import { getAuth } from 'firebase-admin/auth'
import { Config } from '@app/config/configuration'
import { SessionService } from '@app/services/session.service'
import { redirect } from '@remix-run/node'
import { Routes } from '@app/services/routes.service'
import { LoggerStore } from '@app/services/logger.service'
import { authenticateSchema } from '@app/types/auth'
import type { Nullable } from '@app/types'
import { UsersService } from '@app/services/users.service'
import { parse } from 'qs'
import { UserOnboardingStep } from '@prisma/client'

interface FirebaseSession {
  firebase_session_token: string // which can be decoded
}

export interface DecodedClaims {
  sessionToken: string
  email: string
  expiresAt: number
  fbUid: string
}

export interface AuthProfile {
  email: string
  fbUid: string
}

const sessionKey = 'auth:firebase'

@singleton()
export class AdminAuthService {
  private readonly adminApp: App
  private readonly adminAuth: Auth
  private logger = LoggerStore.getLogger(AdminAuthService.name)
  private googleAuthUrl = 'https://identitytoolkit.googleapis.com/v1'
  constructor(
    @inject(Config) private readonly config: Config,
    @inject(SessionService) private readonly sessionStorage: SessionService,
    @inject(UsersService) private readonly usersService: UsersService,
  ) {
    const maybeApps = getApps()
    if (!maybeApps.length) {
      this.adminApp = initializeApp({
        credential: cert(this.config.firebase.admin_cert_json),
      })
    } else {
      this.adminApp = getApp()
    }
    this.adminAuth = getAuth(this.adminApp)
  }

  private getRefreshToken = async (fbUid: string): Promise<string> => {
    const customToken = await this.adminAuth.createCustomToken(fbUid)
    this.logger.info('getRefreshToken: ', { customToken })
    const url = `${this.googleAuthUrl}/accounts:signInWithCustomToken?key=${this.config.firebase.api_key}`
    const res = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    })

    const data = await res.json()
    this.logger.info('getRefreshToken: ', { data })
    return data.idToken
  }

  private verifyToken = async (token: string) => {
    return await this.adminAuth.verifyIdToken(token)
  }

  private verifySession = async (sessionToken: string): Promise<DecodedClaims> => {
    try {
      const decoded = await this.adminAuth.verifySessionCookie(sessionToken)
      if (!decoded.email) {
        throw redirect(Routes.logout)
      }
      return {
        sessionToken,
        expiresAt: decoded.exp * 1000,
        email: decoded.email,
        fbUid: decoded.uid,
      }
    } catch (e) {
      this.logger.error('Error verifying session: ', e)
      throw redirect(Routes.logout)
    }
  }

  private createSession = async (token: string): Promise<DecodedClaims> => {
    try {
      const decoded = await this.verifyToken(token)
      if (!decoded.email) {
        throw redirect(Routes.logout)
      }
      const sessionToken = await this.adminAuth.createSessionCookie(token, {
        expiresIn: 60 * 60 * 1000 * 24, // one - day
      })

      return {
        sessionToken,
        email: decoded.email,
        fbUid: decoded.uid,
        expiresAt: decoded.exp * 1000,
      }
    } catch (e) {
      throw redirect(Routes.logout)
    }
  }

  private getSession = async (req: Request): Promise<null | DecodedClaims> => {
    const session = await this.sessionStorage.getSession(req)
    const firebaseSession: Nullable<FirebaseSession> = session.get(sessionKey) ?? null
    if (!firebaseSession) {
      return null
    }

    const sessionData = await this.verifySession(firebaseSession.firebase_session_token)
    const currentDate = Date.now()
    this.logger.debug('getSession: ', {
      currentDate: new Date(currentDate).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: new Date(sessionData.expiresAt).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit' }),
      timeLeft: `${Math.floor((sessionData.expiresAt - currentDate) / 1000)} seconds`,
    })
    if (currentDate < sessionData.expiresAt - 1000 * 60) {
      return sessionData
    }

    try {
      const refreshToken = await this.getRefreshToken(sessionData.fbUid)
      const { sessionToken } = await this.createSession(refreshToken)
      this.logger.info('getSession: ', { refreshToken, sessionToken })
      const newSession: FirebaseSession = {
        firebase_session_token: sessionToken,
      }
      session.set(sessionKey, newSession)
      throw redirect(req.url, {
        headers: {
          'Set-Cookie': await this.sessionStorage.commitSession(session),
        },
      })
    } catch (e) {
      this.logger.error('error refreshing session: ', { e })
      throw redirect(Routes.logout)
    }
  }

  async authenticate(req: Request) {
    const url = new URL(req.url)
    const params = new URLSearchParams(url.search)
    const body = parse(params.toString())
    const { idToken } = authenticateSchema.parse(body)
    const session = await this.sessionStorage.getSession(req)
    const { sessionToken, email, fbUid } = await this.createSession(idToken)
    const firebaseSession: FirebaseSession = {
      firebase_session_token: sessionToken,
    }
    const user = await this.usersService.upsertUser({ email, fbUid })
    session.set(sessionKey, firebaseSession)
    let redirect_url = `/journals`
    if (user.onboarding_step === UserOnboardingStep.PROFILE) {
      redirect_url = `/user-settings`
    }

    if (user.onboarding_step === UserOnboardingStep.DEMOGRAPHICS) {
      redirect_url = `/user-settings/demographics`
    }

    if (user.onboarding_step === UserOnboardingStep.WELCOME) {
      redirect_url = '/welcome'
    }

    return redirect(redirect_url, {
      headers: {
        'Set-Cookie': await this.sessionStorage.commitSession(session),
      },
    })
  }

  async getAuthProfile(req: Request): Promise<null | AuthProfile> {
    const data = await this.getSession(req)
    if (!data) {
      return null
    }
    return {
      email: data.email,
      fbUid: data.fbUid,
    }
  }

  async signOut(req: Request) {
    const session = await this.sessionStorage.getSession(req)
    return redirect(Routes.home, {
      headers: {
        'Set-Cookie': await this.sessionStorage.destroySession(session),
      },
    })
  }

  async isAuthenticated(req: Request) {
    const session = await this.sessionStorage.getSession(req)
    const firebaseSession: Nullable<FirebaseSession> = session.get(sessionKey) ?? null
    if (!firebaseSession) {
      return false
    }
    return true
  }

  async getPasswordResetLink({ email }: { email: string }) {
    const link = await this.adminAuth.generatePasswordResetLink(email, { url: 'http://localhost:3000/reset-password' })
    return link
  }
}
