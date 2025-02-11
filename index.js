const express = require('express')
const database = require('./src/DataBase.js')
require('dotenv').config({path: './config.env'})
const organization = require('./src/models/Organization.js')
const product = require('./src/models/Product.js')
const user = require('./src/models/User.js')
const inventory = require('./src/models/Inventory.js')
const InventoryMovement = require('./src/models/InventoryMovement.js')

const port = process.env.LISTEN_PORT
const app = express()

app.use(express.json())

database.db
        .sync({force: true})
        .then(() => {
            app.listen(port, () => {
                console.info(`app running in ${port} port`)
            })
        })
        .catch((e) => {
            console.error(`a error was ocorred: ${e}`)
        })

