const express = require('express')
const database = require('./src/DataBase.js')
require('dotenv').config()

const port = process.env.LISTEN_PORT
const app = express()

app.use(express.json())

database

