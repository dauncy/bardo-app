import { PrismaClient } from '@prisma/client'
import type { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'

declare global {
  var __prisma: PrismaClient
  namespace PrismaJson {
    type JournalMetadata = {
      modality: TripModality | string
      intention: TripIntention | string
      setting: TripSetting | string
      dosage: TripDosage
    }
  }
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    datasourceUrl: process.env.POSTGRES_PRISMA_URL,
  })
}
global.__prisma.$connect()
export const prisma = global.__prisma
