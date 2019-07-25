const express = require("express");
const router = express.Router();

const Acampamento = require("../models/acampamento"),
      Comentario  = require("../models/comentario");

router.get("/acampamentos/:id/comentarios/novo", isLoggedIn, (req, res) => {
    Acampamento.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento para comentário:");
            console.log(err);
            res.redirect("/acampamentos");
        } else {
            res.render("comentarios/novo", {acampamento:camp});
        }
    })
});

router.post("/acampamentos/:id/comentarios", isLoggedIn, (req, res) => {
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
                    newComment.author.id = req.user._id;
                    newComment.author.name = req.user.name;
                    newComment.save();
                    camp.comments.push(newComment);
                    camp.save();
                    res.redirect("/acampamentos/" + camp._id);
                }
            })
        }
    })
});

router.get("/acampamentos/:idcamp/comentarios/:idcom/editar", isLoggedIn, (req, res) => {
    Comentario.findById(req.params.idcom, (err, foundComment) => {
        if (err) {
            console.log("=== FALHA AO PROCURAR COMENTARIO PARA EDICAO ===");
            console.log(err);
            res.redirect("/acampamentos/" + req.body.idcamp);
        } else {
            Acampamento.findById(req.params.idcamp, (err, foundCamp) => {
                if (err) {
                    console.log("=== Acampamento Não localizado na edição de comentário ===");
                    console.log(err);
                    res.redirect("/acampamentos");
                } else {
                    res.render("comentarios/edit", {comentario: foundComment, acampamento: foundCamp});
                }
            })
        };
    });
});

router.put("/acampamentos/:idcamp/comentarios/:idcom", isLoggedIn, (req, res) => {
    Comentario.findByIdAndUpdate(req.params.idcom, {text: req.body.text}, (err, comment) => {
        if (err) {
            console.log("=== ERRO AO ATUALIZAR COMENTÁRIO ===");
            console.log(err);
            res.redirect("/acampamentos/" + req.params.idcamp);
        } else {
            res.redirect("/acampamentos/" + req.params.idcamp);
        }
    })
})

router.delete("/acampamentos/:idcamp/comentarios/:idcom", isLoggedIn, (req, res) => {
    Comentario.findById(req.params.idcom).deleteOne((err) => {
        if (err) {
            console.log("=== ERRO AO APAGAR COMENTARIO ===");
            console.log(err);
            res.redirect("/acampamentos/" + req.params.idcamp);
        } else {
            res.redirect("/acampamentos/" + req.params.idcamp);
        }
    })
})

// ==================
// MIDDLEWARE
// ==================

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    };
};

module.exports = router;