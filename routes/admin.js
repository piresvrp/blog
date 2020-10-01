const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")


router.get('/', (req,res) => {
	res.render('admin/index')
})


router.get('/categorias', (req, res) => {
	res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
	res.render('admin/addCategoria')
})

router.get('/posts', (req, res) => {
	res.send('Pagina de  posts')
})

router.post('/categorias/create', (req, res) => {
	const novaCatergoria = {
		nome: req.body.nome,
		slug: req.body.slug
	}
	new Categoria(novaCatergoria).save().then(() => {
		console.log("Saved")
	}).catch((err) => {
		console.log("Erro ao salvar" + err)
	})
})



module.exports = router