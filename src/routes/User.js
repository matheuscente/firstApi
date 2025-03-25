const express = require("express");
const controller = require("../controllers/User.js");
const middleware = require('../middleware/middleware.js')


const route = express.Router();

// adm options
route.get("/admin", middleware.auth('admin'), controller.findAll);
route.get("/admin/:id",middleware.auth('admin'), controller.findOne);
route.post("/admin",middleware.auth('admin'), controller.create);
route.patch("/admin/:id",middleware.auth('admin'), controller.update);
route.delete("/admin/:id",middleware.auth('admin'), controller.delete);

//user options
route.get("/info",middleware.auth(), controller.findOne);
route.patch("/update",middleware.auth(), controller.update);
route.patch("/info",middleware.auth(), controller.findOne);
route.post("/logout", middleware.auth(), controller.logout)
route.post("/newJwt", middleware.authNewJwt(), controller.getNewJwt)


module.exports = route;
