const database = require("../DataBase.js");
const user = require("./User.js");
const product = require("./Product.js");
const inventory = require("./Inventory.js");
const orgnization = require("./Organization.js");

class InventoryMovement {
  constructor() {
    this.model = database.db.define("InventoryMovement", {
      id: {
        type: database.db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: database.db.Sequelize.INTEGER,
        references: {
          model: user,
          key: "id",
        },
        allowNull: false,
      },

      inventoryId: {
        type: database.db.Sequelize.INTEGER,
        references: {
          model: inventory,
          key: "id",
        },
        allowNull: false,
      },

      productId: {
        type: database.db.Sequelize.INTEGER,
        references: {
          model: product,
          key: "id",
        },
        allowNull: false,
      },

      amount: {
        type: database.db.Sequelize.INTEGER,
        allowNull: false,
      },

      typeMoviment: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },

      organizationId: {
        type: database.db.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: orgnization,
          key: "id",
        },
      },
    });

    const associations = {
      user: "userId",
      product: "productId",
      inventory: "inventoryId",
      organization: "organizationId",
    };

    for (const modelName in associations) {
      const foreignKey = associations[modelName];
      this.model.belongsTo(database.db.models[modelName], { foreignKey });
      database.db.models[modelName].hasMany(this.model);
    }
  }
}

module.exports = new InventoryMovement().model;
