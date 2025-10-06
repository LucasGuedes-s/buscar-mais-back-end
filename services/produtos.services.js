const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function cadastrarProduto(req, res) {
    const data = req.body;

    if (!data.nome || !data.preco || !data.categoria || !data.estabelecimentoId) {
      return res.status(400).json({ error: 'Dados obrigatórios não informados' });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome: data.nome,
        preco: parseFloat(data.preco),
        categoria: data.categoria,
        descricao: data.descricao || '',
        foto: data.foto || '', 
        quantidadeEstoque: data.quantidadeEstoque || 0,
        avaliacao: data.avaliacao || 0,
        estabelecimentoId: data.estabelecimentoId,
      },
    });

    return novoProduto;

}

async function listarProdutos(req, res) {
    const produtos = await prisma.produto.findMany({
        where: {
            estabelecimentoId: req.query.estabelecimentoId ? parseInt(req.query.estabelecimentoId) : undefined,
            categoria: req.query.categoria || undefined,
        },
    });

    return produtos;
}
async function listarProdutoPorId(id) {
    const produto = await prisma.produto.findUnique({
        where: {
            id: id,
        },
        include: {
            estabelecimento: true, // Inclui os dados do estabelecimento relacionado
        },
    });
    console.log(produto);
    return produto;
} 
async function adicionarProdutoAoCarrinho(req) {
    
    const { usuarioEmail, produtoId, quantidade } = req.body;
    if (!produtoId || !quantidade || !usuarioEmail) {
        return null; 
    }

    const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
    });

    if (!produto) {
        return null; 
    }

    const carrinhoItem = await prisma.carrinho.create({
        data: {
            produtoId: produto.id,
            quantidade: quantidade,
            usuarioId: usuarioEmail,
        },
    });
    console.log(carrinhoItem);
    return carrinhoItem;
}
async function listarProdutosDoCarrinho(req) {
    const usuarioEmail = req.params.email;
    console.log('Email do usuário recebido:', usuarioEmail);
    if (!usuarioEmail) {
        return []; 
    }
    const produtosCarrinho = await prisma.carrinho.findMany({
        where: {
            usuarioId: usuarioEmail,
        },
        include: {
            produto: true,
        },
    });

    return produtosCarrinho;
}

async function criarPedido(req, res) {
    try {

        const data = req.body;
        if (!data.usuarioEmail || !data.estabelecimentoId || !data.endereco || !data.produtos || !Array.isArray(data.produtos) || data.produtos.length === 0) {
        throw new Error('Dados inválidos para criar pedido');
        }

        const usuario = await prisma.usuario.findUnique({
        where: { gmail: data.usuarioEmail }
        });

        if (!usuario) throw new Error('Usuário não encontrado');

        let total = 0;
        for (const item of data.produtos) {
            const produto = await prisma.produto.findUnique({
                where: { id: item.produtoId }
            });

            if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);
            if (produto.quantidadeEstoque < item.quantidade) throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);

            total += produto.preco * item.quantidade;
        }

        const pedido = await prisma.pedido.create({
            data: {
                usuarioId: usuario.id,
                estabelecimentoId: data.estabelecimentoId,
                endereco: data.endereco,
                observacao: data.observacao || null,
                total: total,
                pagamento: data.pagamento,
                pedidoProdutos: {
                    create: data.produtos.map(item => ({
                        produtoId: item.produtoId,
                        quantidade: item.quantidade
                    }))
                }
            },
            include: { pedidoProdutos: true }
        });

        for (const item of data.produtos) {
            await prisma.produto.update({
                where: { id: item.produtoId },
                data: { quantidadeEstoque: { decrement: item.quantidade } }
            });
        }

        return pedido;

    } catch (error) {
        console.error('Erro ao criar pedido:', error.message);
        throw error;
    }
}

module.exports = {
    cadastrarProduto,
    listarProdutos,
    listarProdutoPorId,
    adicionarProdutoAoCarrinho,
    listarProdutosDoCarrinho,
    criarPedido
};