import { PrismaClient } from '@prisma/client'
import type { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'
import type { UserMetada as UserMetadataDTO } from '@app/types/users'

declare global {
  var __prisma: PrismaClient
  namespace PrismaJson {
    type JournalMetadata = {
      modality: TripModality | string
      intention: TripIntention | string
      setting: TripSetting | string
      dosage: TripDosage
    }
    type UserMetadata = UserMetadataDTO
  }
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient()
}
global.__prisma.$connect()
export const prisma = global.__prisma
