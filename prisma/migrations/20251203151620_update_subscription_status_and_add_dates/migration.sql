/*
  Warnings:

  - The values [APPROVED] on the enum `ApprovalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApprovalStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED');
ALTER TABLE "public"."Subscription" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "approvalStatus" TYPE "ApprovalStatus_new" USING ("approvalStatus"::text::"ApprovalStatus_new");
ALTER TYPE "ApprovalStatus" RENAME TO "ApprovalStatus_old";
ALTER TYPE "ApprovalStatus_new" RENAME TO "ApprovalStatus";
DROP TYPE "public"."ApprovalStatus_old";
ALTER TABLE "Subscription" ALTER COLUMN "approvalStatus" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "subscriptionEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStart" TIMESTAMP(3),
ALTER COLUMN "approvalStatus" SET DEFAULT 'ACTIVE';
