const express = require("express")
const router = express.Router
const mongoose = require("mongoose")
require("../models/Usuarios")
const Usuarios = mongoose.model("usuarios")



router.get('/resgistro', (req, res) => {
  res.render("/usuarios/registro")
})

module.exports = router