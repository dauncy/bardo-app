import { singleton } from 'tsyringe'
import { firebaseConfig } from '@app/config/firebase.client.config'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import {
  getAuth,
  inMemoryPersistence,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { LoggerStore } from '@app/services/logger.service'

@singleton()
export class AuthClient {
  private readonly app: FirebaseApp
  private readonly auth: Auth
  private googleAuthProvider: GoogleAuthProvider
  private logger = LoggerStore.getLogger(AuthClient.name)

  constructor() {
    this.app = initializeApp(firebaseConfig)
    this.auth = getAuth(this.app)
    this.auth.setPersistence(inMemoryPersistence)
    this.googleAuthProvider = new GoogleAuthProvider()
    this.googleAuthProvider.addScope('profile')
    this.googleAuthProvider.addScope('email')
    this.googleAuthProvider.setCustomParameters({ redirect_uri: 'http://localhost:3000/callback' })
  }

  public signInWithGoogle = async () => {
    return await signInWithRedirect(this.auth, this.googleAuthProvider)
  }

  public getRedirectRes = async () => {
    return await getRedirectResult(this.auth)
  }

  public checkEmailExists = async ({ email }: { email: string }) => {
    const methods = await fetchSignInMethodsForEmail(this.auth, email)
    this.logger.debug('checking email: ', methods)
    return methods.includes('password')
  }

  public signInWithEmailAndPassword = async ({ email, password }: { email: string; password: string }) => {
    return await signInWithEmailAndPassword(this.auth, email, password)
  }

  public signUpWithEmailAndPassword = async ({ email, password }: { email: string; password: string }) => {
    return await createUserWithEmailAndPassword(this.auth, email, password)
  }

  public onForgotPassword = async ({ email }: { email: string }) => {
    return await sendPasswordResetEmail(this.auth, email)
  }
}
