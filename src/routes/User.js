const express = require("express");
const controller = require("../controllers/User.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

// adm options
route.get("/admin", auth('admin'), controller.findAll);
route.get("/admin/:id",auth('admin'), controller.findOne);
route.post("/admin",auth('admin'), controller.create);
route.patch("/admin/:id",auth('admin'), controller.update);
route.delete("/admin/:id",auth('admin'), controller.delete);

//user options
route.get("/info",auth(), controller.findOne);
route.patch("/update",auth(), controller.update);

module.exports = route;
