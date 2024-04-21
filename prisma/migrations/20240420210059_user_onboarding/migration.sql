-- CreateEnum
CREATE TYPE "UserOnboardingStep" AS ENUM ('PROFILE', 'DEMOGRAPHICS', 'COMPLETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboarding_step" "UserOnboardingStep" NOT NULL DEFAULT 'PROFILE';
