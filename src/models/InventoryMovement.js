const database = require("../DataBase.js")
const user = require("./User.js")
const product = require("./Product.js")
const inventory = require("./Inventory.js")

class InventoryMovement {
    constructor() {
        this.model = database.db.define("InventoryMovement", {
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
            users: 'userId',
            products: 'productId',
            inventorys: 'inventoryId',
          };
          
          for (const model in associations) {
            const foreignKey = associations[model];
            this.model.belongsTo(sequelize.models[model], { foreignKey });
            sequelize.models[model].hasMany(this.model, { foreignKey });
          }
    }

    
}