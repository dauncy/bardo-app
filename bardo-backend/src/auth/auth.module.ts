import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FirebaseAuthStrategy } from './firebase.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    ConfigModule,
  ],
  providers: [
    FirebaseAuthStrategy
  ],
  exports: [
    PassportModule
  ],
  controllers: [AuthController]
})

export class AuthModule {}
