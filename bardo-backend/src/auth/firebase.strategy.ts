import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase') {
  private _firebaseAdminApp: admin.app.App;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('firebase.jwtSecretOrKey')
    });

    const BARDO_ADMIN_APP = admin.apps.find((app) => app?.name === "BARDO_ADMIN")
    if (BARDO_ADMIN_APP) {
      this._firebaseAdminApp = BARDO_ADMIN_APP
      return;
    }

    this._firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert(this.configService.get('firebase.credentialJSON')!)
    }, "BARDO_ADMIN")
  }

  public validate = async (token: string) => {
    console.log("VALIDATING")
    try {
      const decodedToken = await this._firebaseAdminApp.auth()
        .verifyIdToken(token, true);
      console.log(decodedToken);
      return {
        uid: decodedToken.uid,
        phone: decodedToken.phone_number
      }
    } catch (e) {
      console.error("error validating token: ", e)
      throw new UnauthorizedException();
    }
  }

}