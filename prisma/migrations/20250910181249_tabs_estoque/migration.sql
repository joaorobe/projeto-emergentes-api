-- CreateTable
CREATE TABLE "public"."estoques" (
    "id" SERIAL NOT NULL,
    "sapatoId" INTEGER NOT NULL,
    "tamanho" "public"."Tamanhos" NOT NULL,
    "cor" "public"."Cores" NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estoques_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."estoques" ADD CONSTRAINT "estoques_sapatoId_fkey" FOREIGN KEY ("sapatoId") REFERENCES "public"."sapatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
