const express = require('express')
const database = require('./src/DataBase.js')
require('dotenv').config({path: './config.env'})

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

