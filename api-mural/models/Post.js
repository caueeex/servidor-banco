const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    autor:{
        type: String,
        required: true,
    },
    mensagem: {
        type: String,
        required: true,
    },
    dataCriacao:{
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model('Post', postSchema);