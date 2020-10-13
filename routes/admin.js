const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")


router.get('/', (req, res) => {
	res.render('admin/index')
})


router.get('/categorias', (req, res) => {
	Categoria.find().sort({ date: 'desc' }).lean().then((categoria) => {
		res.render('admin/categorias', { categoria: categoria })

		//res.send(typeof categoria)
	}).catch((err) => {
		req.flash("error_msg", "Erros listar categorias")
		redirect("/admin")
	})

})


router.get('/categorias/add', (req, res) => {
	res.render('admin/addCategoria')
})

router.get('/categoria/edit/:id', (req, res) => {
	Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
		res.render('admin/editCategoria', { categoria: categoria })
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar categoria")
		res.redirect("/admin/categorias")
	})


})


router.post('/categoria/edit', (req, res) => {
	Categoria.findOne({ _id: req.body.id }).then((categoria) => {
		var erros = [];
		if (!req.body.nome || typeof req.body.nome == 'undefined' || req.body.nome == '') {
			erros.push({ texto: "Campo nome é inválido" })
		}

		if (!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == '') {
			erros.push({ texto: "Campo slug é inválido" })
		}

		if (req.body.nome.length <= 2) {
			erros.push({ texto: "Campo nome é muito pequeno" })
		}
		if (erros.length > 0) {
			res.render('admin/editCategoria', { erros: erros })
		} else {
			categoria.nome = req.body.nome
			categoria.slug = req.body.slug
			categoria.save().then(() => {
				req.flash("success_msg", "Categoria salva com sucesso");
				res.redirect("/admin/categorias")
			}).catch((err) => {
				req.flash("error_msg", "houve um erro interno ao salvar  a categoria")
				res.redirect("/admin/categorias/")
			})
		}

	}).catch((err) => {
		req.flash("error_msg", "houve um erro ao editar  a categoria")
		res.redirect("/admin/categorias/")
	})
})


router.get('/posts', (req, res) => {
	res.send('Pagina de  posts')
})


router.get('/teste', (req, res) => {
	res.send(req.flash('succees_msg')[0]);
})


router.post('/categorias/create', (req, res) => {

	var erros = [];

	if (!req.body.nome || typeof req.body.nome == 'undefined' || req.body.nome == '') {
		erros.push({ texto: "Campo nome é inválido" })
	}

	if (!req.body.slug || typeof req.body.slug == 'undefined' || req.body.slug == '') {
		erros.push({ texto: "Campo slug é inválido" })
	}

	if (req.body.nome.length <= 2) {
		erros.push({ texto: "Campo nome é muito pequeno" })
	}

	if (erros.length > 0) {
		res.render('admin/addCategoria', { erros: erros })
	} else {
		const novaCatergoria = {
			nome: req.body.nome,
			slug: req.body.slug
		}
		new Categoria(novaCatergoria).save().then(() => {
			req.flash("success_msg", "Categoria salva com sucesso");
			res.redirect("/admin/categorias")
		}).catch((err) => {
			req.flash("error_msg", "Houve um erro ao cadastrar categorias, tente novamente")
			console.log("Erro ao salvar" + err)
		})

	}
})

router.post('/categorias/deletar/',(req,res) => {
	Categoria.remove({_id:req.body.id}).then(() => {
		req.flash("success_msg", "Categoria deletada com sucesso")
		res.redirect("/admin/categorias")
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao deletar categorias, tente novamente")
		res.redirect("/admin/categorias")
	})
})


module.exports = router