const express               = require("express"),
      bodyParser            = require("body-parser"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose");
      mongoose              = require("mongoose");

const Acampamento = require("./models/acampamento"),
      Comentario  = require("./models/comentario"),
      Usuario     = require("./models/usuario");

const seedDB = require("./seeds");

const app = express();

mongoose.connect("mongodb://localhost:27017/icamp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

seedDB();

// ==================
// PASSPORT CONFIG
// ==================
app.use(require("express-session")({
    secret: "Segredo do express session",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Usuario.authenticate()));
passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
});

app.post("/acampamentos", isLoggedIn, (req, res) => {
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

app.get("/acampamentos/novo", isLoggedIn, (req, res) => {
    res.render("acampamentos/novo");
});

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
});

app.get("/sobre", (req, res) => {
    res.render("sobre");
});

// ==================
// ROTAS COMENTARIOS
// ==================

app.get("/acampamentos/:id/comentarios/novo", isLoggedIn, (req, res) => {
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

app.post("/acampamentos/:id/comentarios", isLoggedIn, (req, res) => {
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
// ROTAS AUTENTICACAO
// ==================

app.get("/registrar", (req, res) => {
    res.render("registrar");
});

app.post("/registrar", (req, res) => {
    const user = new Usuario({ username: req.body.username, name: req.body.name });
    Usuario.register(user, req.body.password, (err, newUser) => {
        if (err) {
            console.log("=== ERRO AO CRIAR NOVO USUARIO ===");
            console.log(err);
            res.render("registrar");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/acampamentos");
        })
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/acampamentos",
    failureRedirect: "/login"
}), (req, res) => {});

app.get("/logout", (req, res) => {
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
        res.redirect("/login");
    };
};

app.listen(3000, "localhost", () => { console.log("Servidor iCamp iniciado.") });