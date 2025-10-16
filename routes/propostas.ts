// routes/propostas.ts

import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from 'zod';
import { verificaToken } from '../middewares/verificaToken';
import { sendMail } from '../services/mailService';

const prisma = new PrismaClient();
const router = Router();

const propostaSchema = z.object({
  clienteId: z.string(),
  sapatoId: z.number(),
  descricao: z.string().min(10,
    { message: "Descrição da Proposta deve possuir, no mínimo, 10 caracteres" }),
});

router.get("/", verificaToken, async (req, res) => {
  try {
    const propostas = await prisma.proposta.findMany({
      include: {
        cliente: true,
        sapato: {
          include: {
            marca: true
          }
        }
      },
      orderBy: { id: 'desc'}
    });
    res.status(200).json(propostas);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    res.status(500).json({ erro: "Falha ao buscar as propostas no servidor." });
  }
});


router.post("/", async (req, res) => {
  const valida = propostaSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }  
  const { clienteId, sapatoId, descricao } = valida.data;

  try {
    const proposta = await prisma.proposta.create({
      data: { 
        clienteId, 
        sapatoId, 
        descricao 
      }
    });
    res.status(201).json(proposta);
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    res.status(400).json({ erro: "Não foi possível registrar a proposta." });
  }
});

router.post("/:id/notificar", verificaToken, async (req, res) => {
  const { id } = req.params;
  try {
    const proposta = await prisma.proposta.findUnique({
      where: { id: Number(id) },
      include: { cliente: true, sapato: { include: { marca: true } } }
    });

    if (!proposta) {
      return res.status(404).json({ erro: "Proposta não encontrada." });
    }

    const subject = `Boas notícias sobre sua reserva! 🎉`;
    const html = `
      <h1>Olá, ${proposta.cliente.nome}!</h1>
      <p>Temos uma ótima notícia! O produto que você reservou está novamente disponível para compra.</p>
      <p><strong>Produto:</strong> ${proposta.sapato.marca.nome} ${proposta.sapato.modelo}</p>
      <p><strong>Sua Reserva:</strong> "${proposta.descricao}"</p>
      <p>Não perca tempo! <a href="http://localhost:5173/detalhes/${proposta.sapato.id}">Clique aqui para acessar a página do produto e garantir o seu.</a></p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe SAPATARIA AVENIDA</p>
    `;

    await sendMail({ to: proposta.cliente.email, subject, html });
    const propostaAtualizada = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { status: 'NOTIFICADO' }
    });

    res.status(200).json({ message: "Notificação enviada com sucesso!", proposta: propostaAtualizada });

  } catch (error) {
    console.error("Erro ao notificar cliente:", error);
    res.status(500).json({ erro: "Erro interno ao tentar enviar notificação." });
  }
});

router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params;
  try {
    const propostas = await prisma.proposta.findMany({
      where: { clienteId },
      include: {
        sapato: {
          include: {
            marca: true
          }
        }
      }
    });
    res.status(200).json(propostas);
  } catch (error) {
    console.error(`Erro ao buscar propostas para o cliente ${clienteId}:`, error);
    res.status(400).json({ erro: "Não foi possível buscar suas propostas."});
  }
});


export default router;