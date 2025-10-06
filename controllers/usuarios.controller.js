const usuario = require('../services/usuarios.services');

async function LoginUsuario(req, res, next) {
    try {
        const Login = await usuario.LoginUser(req);
        res.setHeader('Authorization', `Bearer ${Login.token}`);
        res.status(200).json({ 
            usuario: Login.user
        });
        res.end()
    } catch (error) {
        console.error('Erro no login do usuário', error);
        next(error);
    }
}

async function CadastrarUsuario(req, res, next) {
    try {
        const novoUsuario = await usuario.CadastrarUsuario(req);
        if (!novoUsuario) {
            return res.status(400).json({ message: 'Erro ao cadastrar usuário' });
        }
        // Resposta de sucesso
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário', error);
        next(error);
    }
}
module.exports = { LoginUsuario, CadastrarUsuario };