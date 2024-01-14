import { singleton } from 'tsyringe';
import dotEnv from 'dotenv'
@singleton()
export class Config {
  private readonly config
  constructor() {
    if (typeof window === 'undefined') {
      this.config = dotEnv.config()
    } else {
      this.config = { parsed: window.ENV }
    }
  }

  private get env() {
    return this.config?.parsed
  }

  public get development() {
    return {
      mode: this.env?.NODE_ENV ?? 'development'
    }
  }

  public get security() {
    return {
      session_secret: this.env?.SESSION_SECRET ?? '',
      session_cookie: this.env?.SESSION_COOKIE ?? ''
    }
  }

  public get firebase() {
    return {
      admin_cert_json: JSON.parse(Buffer.from(this.env?.FIREBASE_ADMIN_CERT_BASE64 ?? '', 'base64').toString('ascii')),
      api_key: this.env?.FIREBASE_WEB_API_KEY ?? ''
    }
  }
}
