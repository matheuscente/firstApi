const database = require("../DataBase.js");
const organization = require("./Organization.js");

class Inventory {
  constructor() {
    this.model = database.db.define("inventory", {
      id: {
        type: database.db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },

      organizationId: {
        type: database.db.Sequelize.INTEGER,
        references: {
          model: organization,
          key: "id",
        },
      },
    });

    this.model.belongsTo(organization, {
      foreignKey: "organizationId",
    });

    organization.hasMany(this.model, {
      foreignKey: "organizationId",
    });
  }
}

module.exports = new Inventory().model;
