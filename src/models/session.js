const modelUser = require('./User.js')
const modelToken = require('./refreshToken.js')
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

            refreshTokenId: {
                type: database.db.Sequelize.INTEGER,
                unique: true,
                allowNull: false,
                references: {
                    model: modelToken,
                    key: "id"
                }
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
        this.model.belongsTo(modelToken, {
            foreignKey: "refreshTokenId"
        })

        modelUser.hasMany(this.model, {
            foreignKey: "userId"
        })

        modelToken.hasOne(this.model, {
            foreignKey: "refreshTokenId"
        })
    }
}

module.exports = new Session().model