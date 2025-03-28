const express = require("express");
const controller = require("../controllers/Organization.js");
const middleware = require('../factories/middleware/middleware.js')

const route = express.Router();

route.get("/",middleware.auth(), controller.findOne);
route.patch("/",middleware.auth(), controller.update);
route.delete("/",middleware.auth(), controller.delete);

module.exports = route;
