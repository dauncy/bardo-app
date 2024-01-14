import { PrismaClient } from '@prisma/client'
declare global {
  var __prisma: PrismaClient
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    datasourceUrl: process.env.POSTGRES_PRISMA_URL,
  })
}
global.__prisma.$connect()
export const prisma = global.__prisma
