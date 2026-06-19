/*
  Warnings:

  - You are about to drop the column `VerifyCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyCodeExipy` on the `User` table. All the data in the column will be lost.
  - Added the required column `verifyCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyCodeExpiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "VerifyCode",
DROP COLUMN "verifyCodeExipy",
ADD COLUMN     "verifyCode" TEXT NOT NULL,
ADD COLUMN     "verifyCodeExpiry" TIMESTAMP(3) NOT NULL;
