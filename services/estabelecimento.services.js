const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('../utils/bcrypt.util');

async function CadastrarEstabelecimento(req, res) {
    const data = req.body;
    if (!data.nome || !data.gmail || !data.senha) {
        throw new Error('Dados inválidos para cadastro');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const novoEstabelecimento = await prisma.estabelecimento.create({
        data: {
            nome: data.nome,
            gmail: data.gmail,
            senha: senhaHash,
            foto: data.foto || '',
            descricao: data.descricao || '',
            endereco: data.endereco || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            telefone: data.telefone || '',
            horario: data.horario || '',
            categoria: data.categoria || '',
        },
    });
    
    return novoEstabelecimento;

}
async function ListarEstabelecimentos(req, res) {

    const estabelecimentos = await prisma.estabelecimento.findMany({
        where: {
            OR: [
            req.query.cidade ? { cidade: req.query.cidade } : undefined,
            req.query.categoria ? { categoria: req.query.categoria } : undefined
            ].filter(Boolean)
        }
    });

    return estabelecimentos;
}

async function BuscarEstabelecimento(req, res) {
    const estabelecimento = await prisma.estabelecimento.findUnique({
        where: { id: req },
        include: {
            produtos: true,
        }
    });
    if (!estabelecimento) {
        throw new Error('Estabelecimento não encontrado');
    }
    return estabelecimento;
}

module.exports = {
    CadastrarEstabelecimento,
    ListarEstabelecimentos,
    BuscarEstabelecimento,
}