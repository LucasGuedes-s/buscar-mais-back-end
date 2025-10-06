const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('../utils/bcrypt.util');
let jwt = require('jsonwebtoken');
const config= require('../config/app.config')
require('dotenv').config();

async function LoginUser(req, res) {
    const usuario = req.body;
    if(!usuario.email || !usuario.senha) {
        throw new Error('Usuário ou senha inválido')
    }
    const user = await prisma.usuario.findFirst({
        where:{
            gmail: usuario.email
        }
    })
    if(user == null) {
        throw new Error('Usuário ou senha incorretos')
    }
    const senhaValida = bcrypt.compare(usuario.senha, user.senha);

    if(senhaValida){
        const token = jwt.sign(user, config.jwtSecret, {
            expiresIn: 86400 // 24 horas
        });
        
        return {token: token, user}
    }
    else{
        throw new Error('Usuário ou senha inválido')
    }
}

async function CadastrarUsuario(req, res) {
    const data = req.body;
    console.log('Dados recebidos para cadastro:', data);
    if(!data || !data.nome|| !data.email || !data.senha) {
        throw new Error('Dados inválidos para cadastro')
    }
    const senhaHash = bcrypt.hash(data.senha, 10)
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        uid_aparelho: data.uid_aparelho || '',
        gmail: data.email,
        senha: senhaHash,
        cpf: data.cpf || null,
      },
    });

    return novoUsuario;
}
module.exports = {
    LoginUser,
    CadastrarUsuario
}