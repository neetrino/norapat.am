-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unknown Customer',
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
