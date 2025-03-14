const express = require("express");
const controller = require("../controllers/session.js");
const auth = require('../middleware/auth.js')

const route = express.Router();

route.patch('/newtoken',auth(), controller.setJwt)