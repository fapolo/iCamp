const mongoose = require("mongoose");

const acampamentoSchema = new mongoose.Schema({
    name: String,
    img: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comentario"
        }
    ]
})

module.exports = mongoose.model("Acampamento", acampamentoSchema);