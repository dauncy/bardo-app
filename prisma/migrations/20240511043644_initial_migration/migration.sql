-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('authenticated', 'admin');

-- CreateEnum
CREATE TYPE "UserOnboardingStep" AS ENUM ('PROFILE', 'DEMOGRAPHICS', 'WELCOME', 'COMPLETED');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,
    "name" TEXT,
    "user_id" SERIAL NOT NULL,
    "onboarding_step" "UserOnboardingStep" NOT NULL DEFAULT 'PROFILE',
    "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "status" "JournalStatus" NOT NULL DEFAULT 'PUBLISHED',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
