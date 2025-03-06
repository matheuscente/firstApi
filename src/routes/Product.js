const express = require("express");
const controller = require("../controllers/Product.js");

const route = express.Router();

route.get("/", controller.findAll);
route.get("/:id", controller.findOne);
route.post("/", controller.create);
route.patch("/:id", controller.update);
route.delete("/:id", controller.delete);

module.exports = route;
