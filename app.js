//loading modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash");
require("./models/Postagem")
const Postagem = mongoose.model("postagens")

//Setings
//olá mundo tudo bem
//Session

app.use(session({
	secret: "xxxx222iioo",
	resave: true,
	saveUninitialized: true
}))

app.use(flash())

//Middleware

app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
	//res.locals.message = req.flash();
	next()
})

//BodyParse-r
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

//Mongoose

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log("Conectado com sucesso")
}).catch((err) => {
	console.log("erro ao se conectar" + err)
})

//public

app.use(express.static(path.join(__dirname, "public")))
//Routes

app.get('/', (req, res) => {
	Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((Postagem) => {
		res.render('index', { Postagem: Postagem })
	}).catch((err) => {
		req.flash("error_msg", "Falha na busca por Postagens")
		res.redirect("/404")
	})

})

app.get("/postagem/:slug", (req, res) => {
	Postagem.findOne({slug: req.params.slug }).lean().then((Postagem) => {
		res.render('Postagem/index', {Postagem: Postagem})
	}).catch((err) => {
		req.flash("error_msg", "erro ao buscar posttagem")
		res.redirect("/")
	})

})

app.get("/404", (res, req) => {
	res.send("error 404")
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)

//Others

const PORT = 8087

app.listen(8087, () => {
	console.log('Server Running')
})
