const express = require('express')
const router = express.Router()
const controller = require('../controllers/usuarios.controller')

router.post('/login', controller.LoginUsuario)
router.post('/cadastrar', controller.CadastrarUsuario)
module.exports = router;