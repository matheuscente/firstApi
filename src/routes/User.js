const express = require("express");
const controller = require("../controllers/User.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

// adm options
route.get("/admin", auth(), controller.findAll);
route.get("/admin/:id", controller.findOne);
route.post("/admin", controller.create);
route.patch("/admin/:id", controller.update);
route.delete("/admin/:id", controller.delete);

//user options
route.get("/:id", controller.findOne);
route.patch("/:id", controller.update);

module.exports = route;
