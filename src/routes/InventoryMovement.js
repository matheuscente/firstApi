const express = require("express");
const controller = require("../controllers/InventoryMovement.js");
const middleware = require('../factories/middleware/middleware.js')

const route = express.Router();

route.get("/:inventoryId/",middleware.auth(), controller.findAll);
route.get("/:inventoryId/:id",middleware.auth(), controller.findOne);
route.post("/:inventoryId/",middleware.auth(), controller.create);
route.patch("/:inventoryId/:id",middleware.auth(), controller.update);
route.delete("/:inventoryId/:id",middleware.auth('admin'), controller.delete);

module.exports = route;
