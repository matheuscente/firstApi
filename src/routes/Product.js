const express = require("express");
const controller = require("../controllers/Product.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

route.get("/",auth(), controller.findAll);
route.get("/:id",auth(), controller.findOne);
route.post("/",auth(), controller.create);
route.patch("/:id",auth(), controller.update);
route.delete("/:id",auth(), controller.delete);

module.exports = route;
