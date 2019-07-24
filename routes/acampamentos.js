const express = require("express");
const Acampamento = require("../models/acampamento");
const router = express.Router();

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