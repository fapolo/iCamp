const express = require("express");
const passport = require("passport");
const Usuario = require("../models/usuario");
const router = express.Router();

router.get("/registrar", (req, res) => {
    res.render("registrar");
});

router.post("/registrar", (req, res) => {
    const user = new Usuario({ username: req.body.username, name: req.body.name });
    Usuario.register(user, req.body.password, (err, newUser) => {
        if (err) {
            console.log("=== ERRO AO CRIAR NOVO USUARIO ===");
            console.log(err);
            req.flash("error", "Ocorreu um erro. Tente novamente.");
            res.render("registrar");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Seja bem-vindo ao iCamp!");
            res.redirect("/acampamentos");
        })
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/acampamentos",
    failureRedirect: "/login"
}), (req, res) => {});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// ==================
// MIDDLEWARE
// ==================

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Você precisa acessar a sua conta!");
        res.redirect("/login");
    };
};

module.exports = router;