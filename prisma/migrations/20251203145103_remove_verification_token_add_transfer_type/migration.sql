/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'transfer';

-- DropTable
DROP TABLE "VerificationToken";
