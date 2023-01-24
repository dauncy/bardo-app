import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor() { }
  
  @Get('verify')
  @UseGuards(FirebaseAuthGuard)
  verify() {
    return { verified: true }
  }
}