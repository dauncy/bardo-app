import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './auth/guards/firebase-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }
  

  @Get()
  @UseGuards(FirebaseAuthGuard)
  getHello() {
    return this.appService.getHello()
  }
}