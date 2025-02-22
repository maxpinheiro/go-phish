/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `runs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `shows` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "runs" ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "shows" ALTER COLUMN "slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "runs_slug_key" ON "runs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "shows_slug_key" ON "shows"("slug");
