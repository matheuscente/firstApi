const database = require("../DataBase.js")
const user = require("./User.js")
const product = require("./Product.js")
const inventory = require("./Inventory.js")

class InventoryMovement {
    constructor() {
        this.model = database.db.define("inventory_movement", {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            userId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: user,
                    key: "id"
                },
                allowNull: false
            },

            inventoryId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: inventory,
                    key: "id"},
                    allowNull: false
                },

           productId: {
                type: database.db.Sequelize.INTEGER,
                references: {
                    model: product,
                    key: "id"},
                    allowNull: false
                },


            amount: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false

            },

            //this field define the movimentation type, what is 0 for exit and 1 for entry 
                typeMovimentation: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 0,
                    max: 1
                }
            }
        })


        const associations = {
            user: 'userId',
            product: 'productId',
            inventory: 'inventoryId',
          };
          
          for (const modelName in associations) {
            console.log(database.db.models)
            const foreignKey = associations[modelName];
            this.model.belongsTo(database.db.models[modelName], { foreignKey });
            database.db.models[modelName].hasMany(this.model, { foreignKey });
          }
    }

    
}

module.exports = new InventoryMovement().model