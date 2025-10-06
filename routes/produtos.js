const express = require('express')
const router = express.Router()

const controller = require('../controllers/produtos.controller')

router.post('/cadastrar/produto', controller.cadastrarProduto)
router.post('/criar/pedido', controller.criarPedido)
router.get('/listar/produtos', controller.listarProdutos)
router.get('/listar/produto/:id', controller.listarProdutoPorId)
router.post('/carrinho/adicionar', controller.adicionarProdutoAoCarrinho)
router.get('/carrinho/listar/:email', controller.listarProdutosDoCarrinho)

module.exports = router;