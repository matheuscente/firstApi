const express = require("express");
const controller = require("../controllers/InventoryMovement.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

route.get("/:inventoryId/",auth(), controller.findAll);
route.get("/:inventoryId/:id",auth(), controller.findOne);
route.post("/:inventoryId/",auth(), controller.create);
route.patch("/:inventoryId/:id",auth(), controller.update);
route.delete("/:inventoryId/:id",auth('admin'), controller.delete);

module.exports = route;
