

import { PrismaClient, Tamanhos, Cores } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { verificaToken } from '../middewares/verificaToken'

const prisma = new PrismaClient()
const router = Router()

const estoqueSchema = z.object({
  sapatoId: z.number(),
  tamanho: z.nativeEnum(Tamanhos),
  cor: z.nativeEnum(Cores),
  preco: z.number().positive({ message: "O preço deve ser um valor positivo." }),
  quantidade: z.number().int().nonnegative({ message: "A quantidade não pode ser negativa." }),
})

router.get("/", verificaToken, async (req, res) => {
  try {
    const todosEstoques = await prisma.estoque.findMany({
      include: {
        sapato: {
          include: {
            marca: true
          }
        }
      },
      orderBy: [
        { sapato: { modelo: 'asc' } },
        { tamanho: 'asc' }
      ]
    })
    res.status(200).json(todosEstoques)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/:sapatoId", async (req, res) => {
  const { sapatoId } = req.params
  try {
    const estoques = await prisma.estoque.findMany({
      where: { sapatoId: Number(sapatoId) },
      orderBy: { tamanho: 'asc' }
    })
    res.status(200).json(estoques)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {
  const result = estoqueSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erro: result.error.errors })
  }
  const { sapatoId, tamanho, cor, preco, quantidade } = result.data
  try {
    const novoEstoque = await prisma.estoque.create({
      data: { sapatoId, tamanho, cor, preco, quantidade }
    })
    res.status(201).json(novoEstoque)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { quantidade } = req.body
  if (typeof quantidade !== 'number' || quantidade < 0) {
    return res.status(400).json({ erro: "Quantidade inválida." })
  }
  try {
    const estoqueAtualizado = await prisma.estoque.update({
      where: { id: Number(id) },
      data: { quantidade }
    })
    res.status(200).json(estoqueAtualizado)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const estoqueExcluido = await prisma.estoque.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(estoqueExcluido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router