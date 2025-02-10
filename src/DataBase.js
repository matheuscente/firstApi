const {Sequelize} = require("sequelize")

class DataBase {
    constructor() {
        this.init();
    }

    init() {
        this.db = new Sequelize({
            database: "stock_control",
            host: "localhost",
            dialect: "mysql",
            username: "root@localhost",
            password: ""

        })
    }
}

module.exports = new DataBase()