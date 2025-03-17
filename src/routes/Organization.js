const express = require("express");
const controller = require("../controllers/Organization.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

route.get("/",auth(), controller.findOne);
route.post("/", controller.create);
route.patch("/",auth(), controller.update);
route.delete("/",auth(), controller.delete);

module.exports = route;
