import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersResolvers } from './users.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService, UsersResolvers, AuthModule],
  imports: [PrismaModule],
})
export class UsersModule {}