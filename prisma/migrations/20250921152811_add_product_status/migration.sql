-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('REGULAR', 'HIT', 'NEW', 'CLASSIC');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "status" "public"."ProductStatus" NOT NULL DEFAULT 'REGULAR';
