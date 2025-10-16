-- CreateEnum
CREATE TYPE "public"."StatusProposta" AS ENUM ('PENDENTE', 'NOTIFICADO', 'CONCLUIDA');

-- AlterTable
ALTER TABLE "public"."propostas" ADD COLUMN     "status" "public"."StatusProposta" NOT NULL DEFAULT 'PENDENTE';
