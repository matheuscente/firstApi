const express = require("express")

const route = express.Router()


// adm options
route.get('/admin',  () => {})
route.get('/admin/:id',  () => {})
route.post('/admin',  () => {})
route.post('/admin/:id',  () => {})
route.delete('/admin/:id',  () => {})

//user options 
route.get('/',  () => {})
route.put('/',  () => {})



module.exports = route