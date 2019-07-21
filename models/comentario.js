const mongoose = require("mongoose");

const comentarioSchema = mongoose.Schema({
    text: String,
    author: String
})

module.exports = mongoose.model("Comentario", comentarioSchema);