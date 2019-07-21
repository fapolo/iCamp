const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

const Acampamento = require("./models/acampamento"),
      Comentario  = require("./models/comentario");

const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/icamp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

seedDB();

// ==================
// ROTAS
// ==================
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/acampamentos", (req, res) => {
    Acampamento.find({}, (err, camps) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("acampamentos/acampamentos", {acampamentos: camps} );
        }
    })
})

app.post("/acampamentos", (req, res) => {
    const name = req.body.name;
    const img = req.body.img;
    const desc = req.body.desc;
    const newCamp = {name: name, img: img, desc: desc};
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

app.get("/acampamentos/novo", (req, res) => {
    res.render("acampamentos/novo");
})

app.get("/acampamentos/:id", (req, res) => {
    Acampamento.findById(req.params.id).populate("comments").exec((err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento:")
            console.log(err);
            res.redirect("/acampamentos");
        } else {
            res.render("acampamentos/show", {acampamento: camp} );
        }
    })
})

// ==================
// ROTAS COMENTARIOS
// ==================

app.get("/acampamentos/:id/comentarios/novo", (req, res) => {
    Acampamento.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento para comentário:");
            console.log(err);
            res.redirect("/acampamentos");
        } else {
            res.render("comentarios/novo", {acampamento:camp});
        }
    })
})

app.post("/acampamentos/:id/comentarios", (req, res) => {
    Acampamento.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log("Erro ao buscar acampamento para adicionar comentário:");
            console.log(err);
        } else {
            Comentario.create(req.body.comment, (err, newComment) => {
                if (err) {
                    console.log("Erro salvar novo comentário no DB:");
                    console.log(err);
                    res.redirect("/acampamentos");
                } else {
                    camp.comments.push(newComment);
                    camp.save();
                    res.redirect("/acampamentos/" + camp._id);
                }
            })
        }
    })
})

app.listen(3000, "localhost", () => { console.log("Servidor iCamp iniciado.") });