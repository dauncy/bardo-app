import { Injectable } from '@nestjs/common';
import { NewUser, UpdateUsername } from 'src/graphql.schema';
import { User } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(uid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        uid,
      },
    });
  }

  async create(input: NewUser): Promise<User> {
    return this.prisma.user.create({
      data: input,
    });
  }

  async updateUsername(params: UpdateUsername): Promise<User> {
    const { uid, ...params_without_id } = params;

    return this.prisma.user.update({
      where: {
        uid,
      },
      data: {
        ...params_without_id,
      },
    });
  }

  async delete(uid: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        uid,
      },
    });
  }
}