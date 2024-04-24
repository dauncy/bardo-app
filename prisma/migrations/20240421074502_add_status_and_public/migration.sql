-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" "JournalStatus" NOT NULL DEFAULT 'PUBLISHED';
