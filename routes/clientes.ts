
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { verificaToken } from '../middewares/verificaToken';

const prisma = new PrismaClient();
const router = Router();

const clienteSchema = z.object({
  nome: z.string().min(10, {
    message: "Nome do cliente deve possuir, no mínimo, 10 caracteres"
  }),
  email: z.string().email({message: "Informe um e-mail válido"}),
  senha: z.string(),
  cidade: z.string()
});

router.get("/", verificaToken, async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        _count: {
          select: { propostas: true },
        },
      },
      orderBy: {
        id: 'desc'
      }
    });
    const clientesSemSenha = clientes.map(cliente => {
      const { senha, ...resto } = cliente;
      return resto;
    });
    res.status(200).json(clientesSemSenha);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ erro: "Falha ao buscar a lista de clientes." });
  }
});

function validaSenha(senha: string) {
  const mensa: string[] = [];
  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
  }
  let pequenas = 0, grandes = 0, numeros = 0, simbolos = 0;
  for (const letra of senha) {
    if ((/[a-z]/).test(letra)) pequenas++;
    else if ((/[A-Z]/).test(letra)) grandes++;
    else if ((/[0-9]/).test(letra)) numeros++;
    else simbolos++;
  }
  if (pequenas == 0) mensa.push("Erro... senha deve possuir letra(s) minúscula(s)");
  if (grandes == 0) mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)");
  if (numeros == 0) mensa.push("Erro... senha deve possuir número(s)");
  if (simbolos == 0) mensa.push("Erro... senha deve possuir símbolo(s)");
  return mensa;
}

router.post("/", async (req, res) => {
  const valida = clienteSchema.safeParse(req.body);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }

  const erros = validaSenha(valida.data.senha);
  if (erros.length > 0) {
    res.status(400).json({ erro: erros.join("; ") });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(valida.data.senha, salt);
 
  const { nome, email, cidade } = valida.data;

  try {
    const cliente = await prisma.cliente.create({
      data: { nome, email, senha: hash, cidade }
    });
    const { senha, ...clienteSemSenha } = cliente;
    res.status(201).json(clienteSemSenha);
  } catch (error) {
    if (error instanceof Error && (error as any).code === 'P2002') {
      return res.status(409).json({ erro: "Este e-mail já está em uso." });
    }
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id }
    });
    if (cliente) {
      const { senha, ...clienteSemSenha } = cliente;
      res.status(200).json(clienteSemSenha);
    } else {
      res.status(404).json({ erro: "Cliente não encontrado." });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction([
      prisma.proposta.deleteMany({
        where: { clienteId: id },
      }),
      prisma.cliente.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Cliente e suas reservas foram excluídos com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ erro: "Falha ao excluir o cliente." });
  }
});

export default router;