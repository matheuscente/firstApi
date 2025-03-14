
const database = require("../DataBase.js");
const modelUser = require("./User.js");

class Session {
    constructor() {
        this.model = database.db.define("session", {
            jwt: {
                type: database.db.Sequelize.STRING,
                primaryKey: true,
            },
            refreshToken: {
                type: database.db.Sequelize.STRING,
                unique: true,
            },

            userId: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: modelUser,
                    key: "id"
                }
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