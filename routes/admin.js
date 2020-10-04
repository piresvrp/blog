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

	var erros = [];

	if(!req.body.nome || typeof req.body.nome == 'undefined' || req.body.nome == ''){
		erros.push({texto: "Campo nome é inválido"})
	}

	if(!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == ''){
		erros.push({texto: "Campo slug é inválido"})
	}

	if(req.body.nome.length <= 2){
		erros.push({texto: "Campo nome é muito pequeno"})
	}

	if(erros.length > 0){
		res.render('admin/addCategoria', {erros: erros})
	}else{	
		const novaCatergoria = {
			nome: req.body.nome,
			slug: req.body.slug
		}
		new Categoria(novaCatergoria).save().then(() => {
			dataSuccess = {
				message: "Categoria cadastrada com sucesso"
			}
			//res.send(sucess_msg)
			//res.render("/admin/Categorias", dataSuccess)
			res.render('admin/categorias', dataSuccess)
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao cadastrar categorias, tente novamente")
			console.log("Erro ao salvar" + err)
		})

	}
})



module.exports = router