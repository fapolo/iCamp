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
                    camp.comments.push(newComment);
                    camp.save();
                    res.redirect("/acampamentos/" + camp._id);
                }
            })
        }
    })
});

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