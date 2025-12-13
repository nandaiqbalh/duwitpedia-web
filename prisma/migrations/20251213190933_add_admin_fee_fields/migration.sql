-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "adminFeeAmount" DECIMAL(10,2);
ALTER TABLE "Transaction" ADD COLUMN     "isAdminFee" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Transaction" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;