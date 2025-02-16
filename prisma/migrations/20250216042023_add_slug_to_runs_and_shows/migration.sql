-- AlterTable
ALTER TABLE "runs" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "shows" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';
