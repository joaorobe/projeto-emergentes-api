/*
  Warnings:

  - You are about to drop the column `carroId` on the `propostas` table. All the data in the column will be lost.
  - You are about to drop the `carros` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sapatoId` to the `propostas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Tamanhos" AS ENUM ('BR_36', 'BR_37', 'BR_38', 'BR_39', 'BR_40', 'BR_41', 'BR_42');

-- CreateEnum
CREATE TYPE "public"."Cores" AS ENUM ('PRETO', 'BRANCO', 'VERMELHO', 'AZUL', 'CINZA');

-- DropForeignKey
ALTER TABLE "public"."carros" DROP CONSTRAINT "carros_marcaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."propostas" DROP CONSTRAINT "propostas_carroId_fkey";

-- AlterTable
ALTER TABLE "public"."propostas" DROP COLUMN "carroId",
ADD COLUMN     "sapatoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."carros";

-- DropEnum
DROP TYPE "public"."Combustiveis";

-- CreateTable
CREATE TABLE "public"."sapatos" (
    "id" SERIAL NOT NULL,
    "modelo" VARCHAR(30) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "foto" TEXT NOT NULL,
    "tamanho" "public"."Tamanhos" NOT NULL DEFAULT 'BR_38',
    "cor" "public"."Cores" NOT NULL DEFAULT 'PRETO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT true,
    "marcaId" INTEGER NOT NULL,

    CONSTRAINT "sapatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- AddForeignKey
ALTER TABLE "public"."sapatos" ADD CONSTRAINT "sapatos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."propostas" ADD CONSTRAINT "propostas_sapatoId_fkey" FOREIGN KEY ("sapatoId") REFERENCES "public"."sapatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
