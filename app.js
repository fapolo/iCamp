const express       = require("express"),
      bodyParser    = require("body-parser"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      mongoose      = require("mongoose"),
      flash         = require("connect-flash"),
      dotenv        = require("dotenv").config();

const Usuario       = require("./models/usuario");

const commentRoutes = require("./routes/comentarios"),
      campsRoutes   = require("./routes/acampamentos"),
      authRoutes    = require("./routes/autenticacao.js");

const app = express();

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

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
    res.locals.flashErr = req.flash("error");
    res.locals.flashOk = req.flash("success");
    next();
});

// ==================
// ROTAS
// ==================

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/sobre", (req, res) => {
    res.render("sobre");
});

app.use(campsRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(process.env.PORT, process.env.IP, () => { console.log("Servidor iCamp iniciado.") });