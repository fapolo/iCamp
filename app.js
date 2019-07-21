const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//ARRAY PLACEHOLDER PARA DB DE TESTE
const acampamentos = [
    { name: "Parque da Cachoeira", img: "http://ondeacampar.com.br/wp-content/uploads/Parque-da-Cachoeira-Canela-4.jpg" },
    { name: "Cachoeira dos Borges", img: "http://ondeacampar.com.br/wp-content/uploads/Camping-e-Parque-Cachoeira-dos-Borges-8.jpg" },
    { name: "Praia das Pombas", img: "http://ondeacampar.com.br/wp-content/uploads/Camping-Praia-das-Pombas-16.jpg" },
    { name: "Parque do Sesi", img: "http://ondeacampar.com.br/wp-content/uploads/Parque-do-Sesi-11.jpg" }
]

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/acampamentos", (req, res) => {
    res.render("acampamentos", {acampamentos: acampamentos});
})

app.post("/acampamentos", (req, res) => {
    const newCamp = {name: req.body.name, img: req.body.img}
    acampamentos.push(newCamp);
    res.redirect("/acampamentos");
});

app.get("/acampamentos/novo", (req,res) => {
    res.render("novo");
})

app.listen(3000, "localhost", () => { console.log("Servidor iCamp iniciado.") });