//loading modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
//const mongoose = require('mongoose')


//Setings

	//BodyParser
	app.use(express.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	//Handlebars
	app.engine('handlebars', handlebars({defaultLayout: 'main'}))
	app.set('view engine', 'handlebars');

	//Mongoose



//Others

const PORT = 8087

app.listen(8087, () => {
	console.log('Server Running')
})