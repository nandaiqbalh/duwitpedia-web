-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'transfer';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "toAccountId" TEXT;
