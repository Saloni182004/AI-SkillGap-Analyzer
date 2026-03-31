/*
  Warnings:

  - You are about to drop the column `targetRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `InterviewSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillGapReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewSession" DROP CONSTRAINT "InterviewSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- DropForeignKey
ALTER TABLE "SkillGapReport" DROP CONSTRAINT "SkillGapReport_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "targetRole";

-- DropTable
DROP TABLE "InterviewSession";

-- DropTable
DROP TABLE "Resume";

-- DropTable
DROP TABLE "SkillGapReport";
