const express = require("express")
const controller = require("../controllers/User.js")


const route = express.Router()


// adm options
route.get('/admin',  controller.findAll)
route.get('/admin/:id',  controller.findOne)
route.post('/admin',  controller.create)
route.put('/admin/:id',  controller.update)
route.delete('/admin/:id',  controller.delete)

//user options 
route.get('/',  controller.findOne)
route.put('/',  controller.update)



module.exports = route