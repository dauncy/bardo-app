-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "user_id" SERIAL NOT NULL;
