const express = require("express")
const controller = require("../controllers/InventoryMovement.js")

const route = express.Router()

route.get('/:inventoryId/',  controller.findAll)
route.get('/:inventoryId/:id',  controller.findOne)
route.post('/:inventoryId/',  controller.create)
route.put('/:inventoryId/:id',  controller.update)
route.delete('/:inventoryId/:id',  controller.delete)

module.exports = route