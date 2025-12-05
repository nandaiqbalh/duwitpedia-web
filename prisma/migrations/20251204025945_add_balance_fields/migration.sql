-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "balance" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "balance" DECIMAL(15,2) NOT NULL DEFAULT 0;
