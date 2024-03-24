import { singleton } from 'tsyringe'
import { firebaseConfig } from '@app/config/firebase.client.config'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import type { Auth, User } from 'firebase/auth'
import {
  getAuth,
  inMemoryPersistence,
  signInWithRedirect,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { LoggerStore } from '@app/services/logger.service'
import { isIOS } from '@app/utils/ui.utils'

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
    this.googleAuthProvider.setCustomParameters({ display: 'popup' })
  }

  public signInWithGoogle = async () => {
    if (isIOS()) {
      return await signInWithPopup(this.auth, this.googleAuthProvider)
    }
    return await signInWithRedirect(this.auth, this.googleAuthProvider)
  }

  public getRedirectRes = async (callback?: (user: null | User) => void) => {
    return await new Promise<{ user: null | User }>(res => {
      this.auth.onAuthStateChanged(user => {
        callback && callback(user)
        res({ user })
      })
    })
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

  public signOut = async () => {
    return await signOut(this.auth)
  }
}
