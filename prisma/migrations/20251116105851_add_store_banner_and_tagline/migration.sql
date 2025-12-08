/*
  Warnings:

  - You are about to drop the column `bannerImageKey` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "bannerImageKey",
ADD COLUMN     "bannerKey" TEXT,
ADD COLUMN     "tagline" TEXT;
