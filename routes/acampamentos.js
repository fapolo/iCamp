const express = require("express");
const methodOverride = require("method-override");
const Acampamento = require("../models/acampamento");
const Comentario = require("../models/comentario");
const router = express.Router();

router.use(methodOverride("_method"));

router.get("/acampamentos", (req, res) => {
    Acampamento.find({}, (err, camps) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("acampamentos/acampamentos", {acampamentos: camps} );
        }
    })
});

router.post("/acampamentos", isLoggedIn, (req, res) => {
    const name = req.body.name;
    const img = req.body.img;
    const desc = req.body.desc;
    const user = {id: req.user._id, name: req.user.name};
    const newCamp = {name: name, img: img, desc: desc, user: user};
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

router.get("/acampamentos/novo", isLoggedIn, (req, res) => {
    res.render("acampamentos/novo");
});

router.get("/acampamentos/:id", (req, res) => {
    Acampamento.findById(req.params.id).populate("comments").exec((err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento:")
            console.log(err);
            res.redirect("/acampamentos");
        } else {
            res.render("acampamentos/show", {acampamento: camp} );
        }
    })
});

router.get("/acampamentos/:id/editar", isLoggedIn, (req, res) => {
    Acampamento.findById(req.params.id, (err, foundCamp) => {
        if (err) {
            console.log("=== ERRO AO LOCALIZAR ACAMPAMENTO PARA EDITAR ===");
            console.log(err);
        }
        else if (req.user._id.toString() !== foundCamp.user.id.toString()) {
            console.log("=== USER ACESSANDO CAMP QUE NAO É SEU ===");
            console.log(foundCamp);
            console.log(req.user);
            res.redirect("/acampamentos");
        } else {
            res.render("acampamentos/edit", {acampamento: foundCamp});
        }
    });
});

router.put("/acampamentos/:id", isLoggedIn, (req, res) => {
    const name = req.body.name;
    const img = req.body.img;
    const desc = req.body.desc;
    const updateCamp = {name: name, img: img, desc: desc};
    Acampamento.findAndModify(req.params.id, updateCamp, (err, updatedCamp) => {
        if (err) {
            console.log("=== ERRO AO ATUALIZAR ACAMPAMENTO ===");
            console.log(err);
            console.log(updatedCamp);
            res.redirect("/acampamentos");
        } else {
            res.redirect("/acampamentos/" + updatedCamp._id);
        }
    } )
});

router.delete("/acampamentos/:id", (req, res) => {
    Acampamento.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err) {
            console.log("=== ERRO AO PROCURAR CAMP PARA EXCLUIR ===");
            console.log(err);
            res.redirect("/acampamentos");
        };
        foundCamp.comments.forEach((comment) => {
            Comentario.findById(comment._id).deleteOne( (err) => {
                if (err) {
                    console.log("=== Erro excluindo Comment antes de apagar Camp ===");
                    console.log(err);
                    res.redirect("/acampamentos");
                };
            });
        });
        Acampamento.findById(foundCamp._id).deleteOne( (err) => {
            if (err) {
                console.log("=== ERRO AO EXCLUIR ACAMPAMENTO ===");
                console.log(err);
                res.redirect("/acampamentos");
            }
            res.redirect("/acampamentos");
        });
    });
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