const database = require("../DataBase.js")

class Organization {
    constructor() {
        this.model = database.db.define("organization", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            address: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            phone: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            email: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        })
    }
}

module.exports = new Organization().model