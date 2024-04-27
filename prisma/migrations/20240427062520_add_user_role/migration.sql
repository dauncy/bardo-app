-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('authenticated', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[];
