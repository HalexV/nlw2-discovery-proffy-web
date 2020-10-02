const express = require('express');
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const server = express();

const { pageLanding, pageStudy, pageGiveClasses, saveClasses, pageSuccess, login, createAccount, logout } = require('./pages');

// configurar nunjucks
const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
});

server
// receber os dados do req.body
.use(express.urlencoded({ extended: true }))
.use(express.json())
.use(cookieParser())
// configurar arquivos estáticos (css, scripts, imagens)
.use(express.static("public"))
// rotas da aplicação
.get("*", checkUser)
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", requireAuth, pageGiveClasses)
.get("/success", requireAuth, pageSuccess)
.get("/login", login)
.get("/logout", requireAuth, logout)
.get("/create-account", createAccount)
.post("/create-account", createAccount)
.post("/login", login)
.post("/save-classes", [requireAuth, checkUser], saveClasses)
.listen(5500);