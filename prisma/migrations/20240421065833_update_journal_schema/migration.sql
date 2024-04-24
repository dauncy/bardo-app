-- AlterTable
ALTER TABLE "Journal" ALTER COLUMN "body" DROP NOT NULL,
ALTER COLUMN "metadata" SET DEFAULT '{}';
