require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Post = require('./models/Post');
const Usuario = require('./models/Usuario');
const Prato = require('./models/Prato');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Banco conectado.'))
    .catch((erro) => console.log('Falha', erro));

/** Cardápio digital — rotas da atividade */
app.get('/pratos', async (req, res) => {
    try {
        const filtro = { disponivel: true };
        const { categoria } = req.query;
        if (categoria !== undefined && String(categoria).trim() !== '') {
            filtro.categoria = String(categoria).trim();
        }
        const pratos = await Prato.find(filtro).sort({ nome: 1 });
        res.json(pratos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar pratos.' });
    }
});

app.get('/pratos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ erro: 'ID inválido.' });
        }
        const prato = await Prato.findById(req.params.id);
        if (!prato) {
            return res.status(404).json({ erro: 'Prato não encontrado.' });
        }
        res.json(prato);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar prato.' });
    }
});

app.post('/pratos', async (req, res) => {
    try {
        const body = req.body || {};
        const nome = body.nome;
        const preco =
            body.preco !== undefined ? body.preco : body.preço !== undefined ? body.preço : undefined;
        const categoria = body.categoria;

        const faltando = [];
        if (nome === undefined || nome === null || String(nome).trim() === '') {
            faltando.push('nome');
        }
        if (preco === undefined || preco === null || preco === '') {
            faltando.push('preco');
        }
        if (
            categoria === undefined ||
            categoria === null ||
            String(categoria).trim() === ''
        ) {
            faltando.push('categoria');
        }
        if (faltando.length > 0) {
            return res.status(400).json({
                erro: 'Campos obrigatórios ausentes ou inválidos.',
                campos: faltando,
            });
        }

        const precoNum = typeof preco === 'number' ? preco : Number(preco);
        if (!Number.isFinite(precoNum) || precoNum < 0) {
            return res.status(400).json({ erro: 'Preço deve ser um número válido e não negativo.' });
        }

        const descricao =
            body.descricao !== undefined
                ? body.descricao
                : body.descrição !== undefined
                  ? body.descrição
                  : '';

        const disponivel =
            body.disponivel !== undefined
                ? Boolean(body.disponivel)
                : body.disponível !== undefined
                  ? Boolean(body.disponível)
                  : true;

        const novo = new Prato({
            nome: String(nome).trim(),
            descricao: String(descricao ?? '').trim(),
            preco: precoNum,
            categoria: String(categoria).trim(),
            disponivel,
        });
        await novo.save();
        res.status(201).json(novo);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao cadastrar prato.' });
    }
});



function verificarPulseira(req, res, next){
    const pulseiraDaRequisicao = req.headers.authorization;
    if (!pulseiraDaRequisicao){
        return res.status(401).json({error: 'Acesso negado!'});
    }
    try {
        // Bearer fdkajfdçlsakjfdlçkj
        const tokenLimpo = pulseiraDaRequisicao.replace('Bearer ', '');
        const usuarioValido = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        req.usuario = usuarioValido;
        next();
    } catch(error){
        return res.status(401).json({error: 'Token inválido ou expirado.'});
    }
}

app.post('/api/cadastrar', async (req, res) => {
    try {
        const {email, senha} = req.body;
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoUsuario = new Usuario({email, senha: senhaCriptografada});
        await novoUsuario.save();
        res.status(201).json({mensagem: 'Usuário cadastrado com sucesso!'});
    } catch(error){
        res.status(400).json({erro: 'Erro ao cadastrar o usuário.'});
    }
});



app.post('/api/posts', async (req, res) => {
    try {
        const {autor, mensagem} = req.body;
        if (!autor || !mensagem){
            return res.status(400).json({error: "Campos obrigatórios"});
        }
        const novoPost = new Post({autor, mensagem});
        await novoPost.save();
        res.status(201).json(novoPost);
    } catch(error){
        res.status(500).json({error:"Erro ao tentar postar."});
    }
    
});

app.get('/api/posts', async (req, res) => {
    try{
        const posts = await Post.find().sort({dataCriacao: -1});
        res.json(posts);
    } catch (error){
        res.status(500).json({error: "Erro ao tentar exibir."});
    }
    
});


// rota delete
app.delete('/api/posts/:id', verificarPulseira, async (req, res) => {
   try{
       const postApagado = await Post.findByIdAndDelete(req.params.id);
       if (!postApagado) return res.status(404).json({error: "Not found"})
       res.json({mensagem: 'Recado deletado'});
   } catch (error){
       res.status(500).json({error: 'Erro ao tentar deletar.'});
   }
    
});

// rota para atualizar
app.put('/api/posts/:id', async (req, res) => {
   try{
       const {autor, mensagem} = req.body;
       const postAtualizado = await Post.findByIdAndUpdate(
           req.params.id,
           {autor, mensagem},
           {new: true}
           );
        if (!postAtualizado) return res.status(404).json({error: "Not found"})
        res.json(postAtualizado);
   } catch(error){
       res.status(500).json({error: 'Erro ao tentar atualizar.'});
   }
});



const PORT = process.env.PORT || 80;
// 0.0.0.0 = aceita conexões de fora da EC2/Cloud9 (não só localhost)
app.listen(PORT, '0.0.0.0', () => {
    console.log('Api funcionando');
    console.log(`Cardápio: GET http://localhost:${PORT}/pratos`);
});