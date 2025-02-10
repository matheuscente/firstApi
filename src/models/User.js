const database = require("../DataBase.js")
const organization = require("./Organization.js")

class User {
    constructor() {
        this.model = database.db.define("User", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password : {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            role: {
                type: database.db.Sequelize.INTEGER,
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

        this.model.belongsTo(organization, {foreignKey: 'organizationId'}
        )

        organization.hasMany(this.model, {
            foreignKey: 'organizationId'}
        )
    }
}

module.exports = new User().model