const mongoose = require('mongoose');

const pratoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    descricao: {
        type: String,
        default: '',
        trim: true,
    },
    preco: {
        type: Number,
        required: true,
        min: 0,
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
    },
    disponivel: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Prato', pratoSchema);
