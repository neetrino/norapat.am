-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "originalPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
