const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const usuarioSchema = new mongoose.Schema ({
    name: String,
    username: String,
    password: String
});

usuarioSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Usuario", usuarioSchema);