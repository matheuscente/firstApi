const modelUser = require('./User.js')
const database = require("../DataBase.js");

class Session {
    constructor() {
        this.model = database.db.define("Session", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            
            jwt: {
                type: database.db.Sequelize.STRING,
                unique: true
            },

            refreshToken: {
                type: database.db.Sequelize.STRING,
                unique: true,
                allowNull: false,
            },

            userId: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: modelUser,
                    key: "id"
                }
            }, 
            isValid: {
                type: database.db.Sequelize.BOOLEAN,
                allowNull: false
            }
            
        })

        this.model.belongsTo(modelUser, {
            foreignKey: "userId"
        })

        modelUser.hasMany(this.model, {
            foreignKey: "userId"
        })
    }
}

module.exports = new Session().model