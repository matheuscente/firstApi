const database = require("../DataBase.js");
const organization = require("./Organization.js");

class Product {
  constructor() {
    this.model = database.db.define("product", {
      id: {
        type: database.db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },

      description: {
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
    },{
      defaultScope: {
        include: [{model: organization}],
        attributes: {
          exclude: ['organizationId']
        }
      }
    });

    this.model.belongsTo(organization, {
      foreignKey: "organizationId",
    });

    organization.hasMany(this.model, {
      foreignKey: "organizationId",
    });
  }
}

module.exports = new Product().model;
