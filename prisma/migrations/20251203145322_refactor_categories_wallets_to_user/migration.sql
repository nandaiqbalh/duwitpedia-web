/*
  Warnings:

  - You are about to drop the column `accountId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `AppAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppAccount" DROP CONSTRAINT "AppAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_accountId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "accountId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "accountId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AppAccount";

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
