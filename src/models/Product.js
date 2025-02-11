const database = require("../DataBase.js")
const organization = require("./Organization.js")

class Product {
    constructor() {
        this.model = database.db.define("product", {
            id: {
                type: database.db.Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            description: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            organizationId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: organization,
                    key: 'id' 
                }
            }

        })

        this.model.belongsTo(organization, {
            foreignKey: 'organizationId'
        })

        organization.hasMany(this.model, {
            foreignKey: 'organizationId'
        })
    }
}

<<<<<<< HEAD
module.exports = new Product().model
=======
model.exports = new Product().model
>>>>>>> feat/create-models
