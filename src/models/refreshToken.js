
const database = require("../DataBase.js");

class refreshToken {
    constructor() {
        this.model = database.db.define("refreshToken", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            token: {
                type: database.db.Sequelize.STRING,
                unique: true,
                allowNull: false
            }
            
        })
    }
}

module.exports = new refreshToken().model