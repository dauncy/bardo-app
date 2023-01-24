import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, NewUser, UpdateUsername } from 'src/graphql.schema';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { GQLGuard } from 'src/auth/guards/graphql.auth.guard';

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(GQLGuard)
  @Query('getUser')
  async user(@Args('uid') args: string): Promise<User | null> {
    return this.userService.findOne(args);
  }

  @UseGuards(GQLGuard)
  @Mutation('createUser')
  async create(@Args('input') args: NewUser): Promise<User> {
    return await this.userService.create(args);
  }

  @UseGuards(GQLGuard)
  @Mutation('updateUsername')
  async update(@Args('input') args: UpdateUsername): Promise<User> {
    return this.userService.updateUsername(args);
  }

  @UseGuards(GQLGuard)
  @Mutation('deleteUser')
  async delete(@Args('uid') args: string): Promise<User> {
    return this.userService.delete(args);
  }
}