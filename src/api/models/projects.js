const database = require('../../database.js')

class ModelProjects {
    constructor() {
        this.model = database.db.define('project', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            function: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },
            finzallyDate: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false
            }
        })
    }
}

module.exports = new ModelProjects().model