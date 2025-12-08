/*
  Warnings:

  - You are about to drop the column `address` on the `Delivery` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,sku]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fee` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageKey` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."ProductVariant_sku_key";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "address",
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "distanceInMiles" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "shippingFee" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "imageKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "discount" DOUBLE PRECISION,
ALTER COLUMN "oldPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "shippingRatePerMile" DOUBLE PRECISION NOT NULL DEFAULT 200;

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_sku_key" ON "ProductVariant"("productId", "sku");
