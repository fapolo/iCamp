const mongoose = require("mongoose");

const comentarioSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
        name: String
    }
})

module.exports = mongoose.model("Comentario", comentarioSchema);