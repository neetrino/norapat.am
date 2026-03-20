-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- Add constraint to prevent empty passwords
ALTER TABLE "users" ADD CONSTRAINT "users_password_not_empty" CHECK (LENGTH(TRIM("password")) > 0);
