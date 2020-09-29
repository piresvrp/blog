const express = require('express')
const router = express.Router()



router.get('/', (req,res) => {
	res.send('Pagina  de Principal do adm')
})


router.get('/categorias', (req, res) => {
	res.send('Pagina de categorias')
})

router.get('/posts', (req, res) => {
	res.send('Pagina de  posts')
})





module.exports = router