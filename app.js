//loading modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash");


//Setings

	//Session

	app.use(session({
		secret: "xxxx222iioo",
		resave: true,
		saveUninitialized: true
	}))

	app.use(flash())

	//Middleware

	app.use((req,res,next) => {
		res.locals.success_msg = req.flash('sucess_msg')
		res.locals.error_msg = req.flash('error_msg')
		delete req.session.success_msg;
		delete req.session.error_msg;
		next()
	})

	//BodyParser
	app.use(express.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	//Handlebars
	app.engine('handlebars', handlebars({defaultLayout: 'main'}))
	app.set('view engine', 'handlebars');

	//Mongoose

	mongoose.Promise = global.Promise;
	mongoose.connect("mongodb://localhost/blogapp",{  useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
		console.log("Conectado com sucesso")
	}).catch((err) => {
		console.log("erro ao se conectar" + err)
	})

	//public

	app.use(express.static(path.join(__dirname, "public")))
//Routes

app.get('/', (req, res) => {
	res.send('My Route princial')
})

app.use('/admin', admin)

//Others

const PORT = 8087

app.listen(8087, () => {
	console.log('Server Running')
})