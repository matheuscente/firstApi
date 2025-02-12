const express = require("express")
const controller = require("../controllers/Inventory.js")

const route = express.Router()

route.get('/',  controller.findAll)
route.get('/:id',  controller.findOne)
route.post('/',  controller.create)
route.put('/:id',  controller.update)
route.delete('/:id',  controller.delete)

module.exports = route