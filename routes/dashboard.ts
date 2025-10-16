import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const clientes = await prisma.cliente.count()
    const sapatos = await prisma.sapato.count()
    const propostas = await prisma.proposta.count()
    res.status(200).json({ clientes, sapatos, propostas })
  } catch (error) {
    res.status(400).json(error)
  }
})

type MarcaGroupByNome = {
  nome: string
  _count: {
    sapatos: number
  }
}

router.get("/sapatosMarca", async (req, res) => {
  try {
    const marcas = await prisma.marca.findMany({
      select: {
        nome: true,
        _count: {
          select: { sapatos: true }
        }
      }
    })

    const marcas2 = marcas
        .filter((item: MarcaGroupByNome) => item._count.sapatos > 0)
        .map((item: MarcaGroupByNome) => ({
            marca: item.nome,
            num: item._count.sapatos
        }))
    res.status(200).json(marcas2)
  } catch (error) {
    res.status(400).json(error)
  }
})

type ClienteGroupByCidade = {
  cidade: string
  _count: {
    cidade: number
  }
}

router.get("/clientesCidade", async (req, res) => {
  try {
    const clientes = await prisma.cliente.groupBy({
      by: ['cidade'],
      _count: {
        cidade: true,
      },
    })

    const clientes2 = clientes.map((cliente: ClienteGroupByCidade) => ({
      cidade: cliente.cidade,
      num: cliente._count.cidade
    }))

    res.status(200).json(clientes2)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
