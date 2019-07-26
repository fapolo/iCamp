const Acampamento = require("../models/acampamento"),
      Comentario  = require("../models/comentario");

const middlewares = {
    isLoggedIn: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error", "Você precisa acessar a sua conta!");
            res.redirect("back");
        };
    },

    checkCampOwnership: function (req, res, next) {
        Acampamento.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                console.log("=== ERRO AO LOCALIZAR ACAMPAMENTO PARA EDITAR ===");
                console.log(err);
                req.flash("error", "Ocorreu um problema. Tente novamente.");
                res.redirect("back");
            }
            else if (foundCamp.user.id.equals(req.user._id)) {
                next();
            } else {
                console.log("=== USER ACESSANDO CAMP QUE NAO É SEU ===");
                console.log(foundCamp);
                console.log(req.user);
                req.flash("error", "Você não pode acessar isto.");
                res.redirect("back");
            }
        });
    },

    checkComOwnership: function (req, res, next) {
        Comentario.findById(req.params.idcom, (err, foundComment) => {
            if (err) {
                console.log("=== FALHA AO PROCURAR COMENTARIO PARA EDICAO ===");
                console.log(err);
                req.flash("error", "Ocorreu um erro. Tente novamente.");
                res.redirect("back");
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                console.log("=== USER ACESSANDO COMMENT QUE NAO É SEU ===");
                console.log(foundComment);
                console.log(req.user);
                req.flash("error", "Você não pode acessar isto.");
                res.redirect("back");
            }
        })
    }
}

module.exports = middlewares;