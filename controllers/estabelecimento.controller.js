const estabelecimento = require('../services/estabelecimento.services');
async function CadastrarEstabelecimento(req, res) {
    try {
        const novoEstabelecimento = await estabelecimento.CadastrarEstabelecimento(req);
        if (!novoEstabelecimento) {
            return res.status(400).json({ message: 'Erro ao cadastrar estabelecimento' });
        }
        // Resposta de sucesso
        res.status(201).json({ message: 'Estabelecimento cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar estabelecimento', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
async function ListarEstabelecimentos(req, res) {
    try {
        const estabelecimentos = await estabelecimento.ListarEstabelecimentos(req);
        if (!estabelecimentos || estabelecimentos.length === 0) {
            return res.status(404).json({ message: 'Nenhum estabelecimento encontrado' });
        }
        // Resposta de sucesso
        res.status(200).json(estabelecimentos);
    } catch (error) {
        console.error('Erro ao listar estabelecimentos', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function BuscarEstabelecimentoPorId(req, res) {
    try {
        const id = req.params.id;
        console.log('Buscando estabelecimento com ID:', id);
        const estabelecimento_id = await estabelecimento.BuscarEstabelecimento(id);
        if (!estabelecimento_id) {
            return res.status(404).json({ message: 'Estabelecimento não encontrado' });
        }
        // Resposta de sucesso
        res.status(200).json(estabelecimento_id);
    } catch (error) {
        console.error('Erro ao buscar estabelecimento', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { CadastrarEstabelecimento, ListarEstabelecimentos, BuscarEstabelecimentoPorId };