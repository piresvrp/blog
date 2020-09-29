//loading modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
//const mongoose = require('mongoose')


//Setings

	//BodyParser
	app.use(express.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	//Handlebars
	app.engine('handlebars', handlebars({defaultLayout: 'main'}))
	app.set('view engine', 'handlebars');

	//Mongoose


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