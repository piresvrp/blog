const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

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

router.post('/categorias/deletar/', (req, res) => {
	Categoria.remove({ _id: req.body.id }).then(() => {
		req.flash("success_msg", "Categoria deletada com sucesso")
		res.redirect("/admin/categorias")
	}).catch((err) => {
		req.flash("error_msg", "Houve um erro ao deletar categorias, tente novamente")
		res.redirect("/admin/categorias")
	})
})




router.get("/postagens", (req, res) => {

	Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((Postagem) => {
		res.render('admin/postagens', { Postagem: Postagem })
	}).catch((err) => {
		req.flash("error_msg", "Falha na busca por Postagens")
		res.redirect("/admin")
	})

})


router.get("/postagem/add", (req, res) => {

	Categoria.find().lean().then((categoria) => {
		res.render("admin/addPostagem", { categoria: categoria })
	}).catch((err) => {
		req.flash("error_msg", "Falha na busca por categorias")
		res.redirect("/admin")
	})

})


router.post("/postagem/salvar", (req, res) => {
	var erros = []
	if (req.body.categoria == 0 || typeof req.body.categoria == 'undefined' || req.body.categoria == '') {
		erros.push({ text: "categoria invalida, tente novamente" })
	}
	if (erros.length > 0) {
		res.render('admin/addPostagem', { erros: erros })
	} else {

		if (req.body.id != null && typeof req.body.id != 'undefined' && req.body.id != '') {
			Postagem.findOne({ _id: req.body.id }).then((postagem) => {
				postagem.titulo = req.body.titulo
				postagem.slug = req.body.slug
				postagem.descricao = req.body.descricao
				postagem.conteudo = req.body.conteudo
				postagem.categoria = req.body.categoria
				postagem.save().then(() => {
					req.flash("success_msg", "Postagem salva com sucesso");
					res.redirect("/admin/postagens")
				}).catch((err) => {
					req.flash("error_msg", "houve um erro interno ao salvar  a Postagem")
					res.redirect("/admin/postagens")
				})
			}).catch((err) => {
				req.flash("error_msg", "houve um erro ao editar  a categoria")
				res.redirect("/admin/postagens")
			})

		} else {
			const novaPostagem = {
				titulo: req.body.titulo,
				slug: req.body.slug,
				descricao: req.body.descricao,
				conteudo: req.body.conteudo,
				categoria: req.body.categoria,
			}
			new Postagem(novaPostagem).save().then(() => {
				req.flash("success_msg", "Postagem salva com sucesso")
				res.redirect("/admin/postagens")
			}).catch((err) => {
				req.flash("error_msg", "Erro ao salvar postagem tente novamente")
				res.redirect("/admin/postagens")
			})
		}
	}

})


router.get("/postagem/edit/:id", (req, res) => {
	Postagem.findOne({ _id: req.params.id }).lean().then((Postagem) => {
		Categoria.find().lean().then((Categorias) => {
			res.render('admin/editPostagem', { Postagem: Postagem, Categorias: Categorias })
		}).catch((err) => {
			req.flash("error_msg", "Erro ao buscar categorias em postagens")
			res.redirect("admin/Postagem")
		})
	}).catch((err) => {
		req.flash("error_msg", "erro ao buscar posttagem")
		res.redirect("/admin/Postagem")
	})

})

router.post("/postagem/deletar",(req, res) => {
	Postagem.remove({_id: req.body.id}).then(() => {
		req.flash("success_msg", "Postagem deletada com sucesso")
		res.redirect("/admin/postagens")
	}).catch((err) => {
		console.log(err)
		req.flash("error_msg", "Erro ao deletar postagem")
		res.redirect("/admin/postagens")
	})
})


module.exports = router