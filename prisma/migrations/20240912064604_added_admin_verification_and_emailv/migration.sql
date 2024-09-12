-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('BASIC', 'MID', 'PREMIUM', 'LUXURY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerifiedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oneTimeOtp" INTEGER;
