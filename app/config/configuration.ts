import { singleton } from 'tsyringe'
import dotEnv from 'dotenv'
@singleton()
export class Config {
  constructor() {
    if (typeof window === 'undefined') {
      dotEnv.config()
    }
  }

  private get env() {
    try {
      return process.env
    } catch (e) {
      return {} as { [key: string]: string }
    }
  }

  public get development() {
    return {
      mode: this.env?.NODE_ENV ?? 'development',
    }
  }

  public get security() {
    return {
      session_secret: this.env?.SESSION_SECRET ?? '',
      session_cookie: this.env?.SESSION_COOKIE ?? '',
    }
  }

  public get firebase() {
    return {
      admin_cert_json: JSON.parse(Buffer.from(this.env?.FIREBASE_ADMIN_CERT_BASE64 ?? '', 'base64').toString('ascii')),
      api_key: this.env?.FIREBASE_WEB_API_KEY ?? '',
    }
  }

  public get r2() {
    return {
      base_url: process.env.R2_URL ?? '',
      access_key: process.env.R2_ACCESS_KEY ?? '',
    }
  }
}
