const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");
const Acampamento = require("../models/acampamento");
const Comentario = require("../models/comentario");
const middleware = require("../middleware");
const router = express.Router();

router.use(methodOverride("_method"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});


// ==================
// ROTAS
// ==================
router.get("/acampamentos", (req, res) => {
    Acampamento.find({}, (err, camps) => {
        if (err) {
            console.log("=== ERRO AO RECUPERAR ACAMPAMENTOS DO DB ===");
            console.log(err);
            req.flash("error", "Houve um problema. Tente novamente.");
            res.redirect("/");
        } else {
            res.render("acampamentos/acampamentos", {acampamentos: camps} );
        }
    })
});

router.post("/acampamentos", middleware.isLoggedIn, upload.single("img"), (req, res) => {
    const dir = "/uploads";
    const index = req.file.destination.indexOf(dir);
    const imgPath = req.file.destination.slice(index) + "/" + req.file.filename;
    const name = req.body.name,
          desc = req.body.desc,
          img = imgPath,
          user = {id: req.user._id, name: req.user.name};
    const newCamp = {name: name, desc: desc, img: img, user: user};
    Acampamento.create(newCamp, (err, newCamp) => {
        if (err) {
            console.log("ERRO AO ADICIONAR ACAMPAMENTO");
            console.log(err);
            req.flash("error", "Ocorreu um erro. Tente novamente.");
            res.redirect("/acampamentos");
        } else {
            req.flash("success", "Acampamento adicionado com sucesso!");
            res.redirect("/acampamentos");
        }
    })
});

router.get("/acampamentos/novo", middleware.isLoggedIn, (req, res) => {
    res.render("acampamentos/novo");
});

router.get("/acampamentos/:id", (req, res) => {
    Acampamento.findById(req.params.id).populate("comments").exec((err, camp) => {
        if (err) {
            console.log("Erro na busca de um acampamento:")
            console.log(err);
            req.flash("error", "Ocorreu um problema. Tente novamente.");
            res.redirect("/acampamentos");
        } else {
            res.render("acampamentos/show", {acampamento: camp} );
        }
    })
});

router.get("/acampamentos/:id/editar",
            middleware.isLoggedIn,
            middleware.checkCampOwnership,
            (req, res) => {
                Acampamento.findById(req.params.id, (err, foundCamp) => {
                    res.render("acampamentos/edit", {acampamento: foundCamp})
                })
});

router.put("/acampamentos/:id",
            middleware.isLoggedIn,
            middleware.checkCampOwnership,
            upload.single("img"),
            (req, res) => {
                const dir = "/uploads";
                const index = req.file.destination.indexOf(dir);
                const imgPath = req.file.destination.slice(index) + "/" + req.file.filename;
                const name = req.body.name,
                      img = imgPath,
                      desc = req.body.desc;
                const updateCamp = {name: name, img: img, desc: desc};
                Acampamento.findByIdAndUpdate(req.params.id, updateCamp, (err, updatedCamp) => {
                    if (err) {
                        console.log("=== ERRO AO ATUALIZAR ACAMPAMENTO ===");
                        console.log(err);
                        console.log(updatedCamp);
                        req.flash("error", "Ocorreu um erro. Tente novamente.");
                        res.redirect("/acampamentos");
                    } else {
                        req.flash("success", "Acampamento atualizado com sucesso!");
                        res.redirect("/acampamentos/" + updatedCamp._id);
                    }
                })
});

router.delete("/acampamentos/:id",
               middleware.isLoggedIn,
               middleware.checkCampOwnership,
               (req, res) => {
                    Acampamento.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
                        if (err) {
                            console.log("=== ERRO AO PROCURAR CAMP PARA EXCLUIR ===");
                            console.log(err);
                            req.flash("error", "Ocorreu um erro. Tente novamente.");
                            res.redirect("/acampamentos");
                        };
                        const imgPath = "./public" + foundCamp.img;
                        fs.unlink(imgPath, (err) => { if (err) { console.log(err); }});
                        foundCamp.comments.forEach((comment) => {
                            Comentario.findById(comment._id).deleteOne( (err) => {
                                if (err) {
                                    console.log("=== Erro excluindo Comment antes de apagar Camp ===");
                                    console.log(err);
                                    req.flash("error", "Ocorreu um erro. Tente novamente.");
                                    res.redirect("/acampamentos");
                                };
                            });
                        });
                        Acampamento.findById(foundCamp._id).deleteOne( (err) => {
                            if (err) {
                                console.log("=== ERRO AO EXCLUIR ACAMPAMENTO ===");
                                console.log(err);
                                req.flash("error", "Ocorreu um erro. Tente novamente.");
                                res.redirect("/acampamentos");
                            }
                            req.flash("Success", "Acampamento removido.");
                            res.redirect("/acampamentos");
                        });
                    });
});

module.exports = router;