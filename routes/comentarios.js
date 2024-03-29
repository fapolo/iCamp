const express = require("express");
const middleware = require("../middleware");
const router = express.Router();

const Acampamento = require("../models/acampamento"),
      Comentario  = require("../models/comentario");

router.get("/acampamentos/:id/comentarios/novo", middleware.isLoggedIn, (req, res) => {
    Acampamento.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento para comentário:");
            console.log(err);
            req.flash("error", "Ocorreu um erro. Tente novamente.");
            res.redirect("/acampamentos");
        } else {
            res.render("comentarios/novo", {acampamento:camp});
        }
    })
});

router.post("/acampamentos/:id/comentarios", middleware.isLoggedIn, (req, res) => {
    Acampamento.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log("Erro ao buscar acampamento para adicionar comentário:");
            console.log(err);
            req.flash("error", "Ocorreu um erro. Tente novamente.");
            res.redirect("/acampamentos");
        } else {
            Comentario.create(req.body.comment, (err, newComment) => {
                if (err) {
                    console.log("Erro salvar novo comentário no DB:");
                    console.log(err);
                    req.flash("error", "Ocorreu um erro. Tente novamente.");
                    res.redirect("/acampamentos");
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.name = req.user.name;
                    newComment.save();
                    camp.comments.push(newComment);
                    camp.save();
                    req.flash("success", "Comentário adicionado com sucesso!");
                    res.redirect("/acampamentos/" + camp._id);
                }
            })
        }
    })
});

router.get("/acampamentos/:idcamp/comentarios/:idcom/editar",
            middleware.isLoggedIn,
            middleware.checkComOwnership,
            (req, res) => {
                Comentario.findById(req.params.idcom, (err, foundComment) => {
                    Acampamento.findById(req.params.idcamp, (err, foundCamp) => {
                        if (err) {
                            console.log("=== Acampamento Não localizado na edição de comentário ===");
                            console.log(err);
                            req.flash("error", "Ocorreu um erro. Tente novamente.");
                            res.redirect("back");
                        } else {
                            res.render("comentarios/edit", {
                                comentario: foundComment,
                                acampamento: foundCamp
                            });
                        }
                    })
                });
});

router.put("/acampamentos/:idcamp/comentarios/:idcom",
            middleware.isLoggedIn,
            middleware.checkComOwnership,
            (req, res) => {
                Comentario.findByIdAndUpdate(req.params.idcom, {text: req.body.text}, (err, comment) => {
                    if (err) {
                        console.log("=== ERRO AO ATUALIZAR COMENTÁRIO ===");
                        console.log(err);
                        req.flash("error", "Ocorreu um erro. Tente novamente.");
                        res.redirect("back");
                    } else {
                        req.flash("success", "Comentário atualizado com sucesso!");
                        res.redirect("/acampamentos/" + req.params.idcamp);
                    }
                })
})

router.delete("/acampamentos/:idcamp/comentarios/:idcom",
               middleware.isLoggedIn,
               middleware.checkComOwnership,
               (req, res) => {
                    Comentario.findById(req.params.idcom).deleteOne((err) => {
                        if (err) {
                            console.log("=== ERRO AO APAGAR COMENTARIO ===");
                            console.log(err);
                            req.flash("error", "Ocorreu um erro. Tente novamente.");
                            res.redirect("back");
                        } else {
                            req.flash("success", "Comentário removido com sucesso");
                            res.redirect("/acampamentos/" + req.params.idcamp);
                        }
                    })
})

module.exports = router;