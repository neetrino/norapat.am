-- DropIndex
DROP INDEX "idx_categories_is_active";

-- DropIndex
DROP INDEX "idx_products_available_category";

-- DropIndex
DROP INDEX "idx_products_available_status";

-- DropIndex
DROP INDEX "idx_products_category_id";

-- DropIndex
DROP INDEX "idx_products_created_at";

-- DropIndex
DROP INDEX "idx_products_is_available";

-- DropIndex
DROP INDEX "idx_products_status";

-- CreateTable
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" INTEGER,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,
    "minOrderAmount" DOUBLE PRECISION DEFAULT 0,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");
