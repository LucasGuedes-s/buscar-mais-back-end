const produtos = require('../services/produtos.services');

async function cadastrarProduto(req, res) {
    try {
        const novoProduto = await produtos.cadastrarProduto(req);
        if (!novoProduto) {
            return res.status(400).json({ message: 'Erro ao cadastrar produto' });
        }
        // Resposta de sucesso
        res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto });
    } catch (error) {
        console.error('Erro ao cadastrar produto', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function listarProdutos(req, res) {
    try {
        const produtosListados = await produtos.listarProdutos(req);
        if (!produtosListados || produtosListados.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado' });
        }
        // Resposta de sucesso
        res.status(200).json(produtosListados);
    } catch (error) {
        console .error('Erro ao listar produtos', error);  
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
async function listarProdutoPorId(req, res) {
    try {
        console.log('ID do produto recebido:', req.params.id);
        const produto = await produtos.listarProdutoPorId(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        // Resposta de sucesso
        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao listar produto por ID', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
async function adicionarProdutoAoCarrinho(req, res) {
    try {
        const produtoAdicionado = await produtos.adicionarProdutoAoCarrinho(req);
        if (!produtoAdicionado) {
            return res.status(400).json({ message: 'Erro ao adicionar produto ao carrinho' });
        }
        // Resposta de sucesso
        res.status(201).json({ message: 'Produto adicionado ao carrinho com sucesso', produto: produtoAdicionado });
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
async function listarProdutosDoCarrinho(req, res) {
    try {
        const produtosCarrinho = await produtos.listarProdutosDoCarrinho(req);
        if (!produtosCarrinho || produtosCarrinho.length === 0) {
            return res.status(404).json({ message: 'Nenhum produto encontrado no carrinho' });
        }
        // Resposta de sucesso
        res.status(200).json(produtosCarrinho);
    } catch (error) {
        console.error('Erro ao listar produtos do carrinho', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
async function criarPedido(req, res) {
    try {
        const novoPedido = await produtos.criarPedido(req, res);
        if (!novoPedido) {
            return res.status(400).json({ message: 'Erro ao criar pedido' });
        }
        // Resposta de sucesso
        res.status(201).json({ message: 'Pedido criado com sucesso', pedido: novoPedido });
    } catch (error) {
        console.error('Erro ao criar pedido', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { cadastrarProduto, listarProdutos, listarProdutoPorId, adicionarProdutoAoCarrinho, listarProdutosDoCarrinho, criarPedido};