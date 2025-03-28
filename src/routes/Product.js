const express = require("express");
const controller = require("../controllers/Product.js");
const middleware = require('../factories/middleware/middleware.js')

const route = express.Router();

route.get("/",middleware.auth(), controller.findAll);
route.get("/:id",middleware.auth(), controller.findOne);
route.post("/",middleware.auth(), controller.create);
route.patch("/:id",middleware.auth(), controller.update);
route.delete("/:id",middleware.auth(), controller.delete);

module.exports = route;
