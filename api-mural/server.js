require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Post = require('./models/Post');
const Usuario = require('./models/Usuario');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Banco conectado.'))
    .catch((erro) => console.log('Falha', erro));
    


function verificarPulseira(req, res, next){
    const pulseiraDaRequisicao = req.headers.authorization;
    if (!pulseiraDaRequisicao){
        return res.status(401).json({error: 'Acesso negado!'});
    }
    try {
        // Bearer fdkajfdçlsakjfdlçkj
        const tokenLimpo = pulseiraDaRequisicao.replace('Bearer ', '');
        const usuarioValido = jwt(tokenLimpo, process.env.JWT.JWT_SECRET);
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
app.listen(PORT, () => {
    console.log("Api funcionando");
    console.log("Use http://ipec2/api/posts");
});