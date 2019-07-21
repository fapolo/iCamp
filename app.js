const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost:27017/icamp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//SCHEMA PARA O DB
const acampamentoSchema = new mongoose.Schema({
    name: String,
    img: String
})

const Acampamento = mongoose.model("Acampamento", acampamentoSchema);

//ROTAS
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/acampamentos", (req, res) => {
    Acampamento.find({}, (err, camps) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("acampamentos", {acampamentos: camps} );
        }
    })
})

app.post("/acampamentos", (req, res) => {
    const name = req.body.name;
    const img = req.body.img;
    const newCamp = {name: name, img: img};
    Acampamento.create(newCamp, (err, newCamp) => {
        if (err) {
            console.log("ERRO AO ADICIONAR ACAMPAMENTO");
            console.log(err);
            console.log("-> Acampamento que foi tentando adicionar:");
            console.log(newCamp);
            res.redirect("/acampamentos");
        } else {
            res.redirect("/acampamentos");
        }
    })
});

app.get("/acampamentos/novo", (req,res) => {
    res.render("novo");
})

app.listen(3000, "localhost", () => { console.log("Servidor iCamp iniciado.") });