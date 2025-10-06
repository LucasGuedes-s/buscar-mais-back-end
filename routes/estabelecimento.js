const express = require('express')
const router = express.Router()
const controller = require('../controllers/estabelecimento.controller')

//router.post('/login/estabelecimento', controller.LoginUsuario)
router.post('/cadastrar/estabelecimento', controller.CadastrarEstabelecimento)
router.get('/listar/estabelecimentos', controller.ListarEstabelecimentos)
router.get('/buscar/estabelecimento/:id', controller.BuscarEstabelecimentoPorId)
module.exports = router;