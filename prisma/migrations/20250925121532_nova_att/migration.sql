/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `senha` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(60)`.

*/
-- DropIndex
DROP INDEX "public"."admins_email_key";

-- AlterTable
ALTER TABLE "public"."admins" DROP CONSTRAINT "admins_pkey",
ADD COLUMN     "nivel" SMALLINT NOT NULL DEFAULT 2,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "senha" SET DATA TYPE VARCHAR(60),
ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "admins_id_seq";

-- AlterTable
ALTER TABLE "public"."propostas" ADD COLUMN     "adminId" VARCHAR(36);

-- AlterTable
ALTER TABLE "public"."sapatos" ADD COLUMN     "adminId" VARCHAR(36);

-- AddForeignKey
ALTER TABLE "public"."sapatos" ADD CONSTRAINT "sapatos_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."propostas" ADD CONSTRAINT "propostas_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
