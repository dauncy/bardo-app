import { singleton } from "tsyringe";
import { LoggerStore } from "@app/services/logger.service";
import { UserDTO } from "@app/types/users";
import { prisma } from "@app/db.server";

@singleton()
export class UsersService {
  private readonly logger = LoggerStore.getLogger(UsersService.name);

  async upsertUser(data: UserDTO) {
    return await prisma.user.upsert({ 
      where: { 
        id: data.fbUid
      },
      create: {
        id: data.fbUid,
        email: data.email,
        name: data.name,
        picture: data.picture
      },
      update: {
        email: data.email,
        name: data.name,
      }
    })
  }
}
