import { Config } from '@app/config/configuration'
import type { Session, SessionData, SessionStorage } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import { inject, singleton } from 'tsyringe'

@singleton()
export class SessionService {
  public readonly sessionStorage: SessionStorage<SessionData, SessionData>

  constructor(@inject(Config) private readonly config: Config) {
    this.sessionStorage = createCookieSessionStorage({
      cookie: {
        name: this.config.security.session_cookie,
        sameSite: 'strict',
        path: '/',
        httpOnly: true,
        secrets: [this.config.security.session_secret],
        secure: this.config.development.mode === 'production',
      },
    })
  }

  public getSession = async (request: Request) => {
    return await this.sessionStorage.getSession(request.headers.get('Cookie'))
  }

  public destroySession = async (session: Session<SessionData, SessionData>) => {
    return await this.sessionStorage.destroySession(session)
  }

  public commitSession = async (session: Session<SessionData, SessionData>) => {
    return await this.sessionStorage.commitSession(session)
  }
}
