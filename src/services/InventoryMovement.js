const model = require("../models/InventoryMovement.js");
const serviceOrganization = require("./Organization.js");
const error = require("../services/error.js");
const serviceProduct = require('../services/Product.js')
const serviceUser = require('../services/User.js')
const serviceInventory = require('../services/Inventory.js')

class InventoryMovement {
  async findAll(organizationId, inventoryId) {
    await serviceOrganization.verifyOrganization(organizationId);

    const inventory = await serviceInventory.findOne(organizationId, inventoryId)

    if(!inventory) {
        throw error('no inventory has found')
    }

    const movements = await model.findAll({
      where: { inventoryId, organizationId },
    });

    if (!movements) {
      throw error("no movements have found");
    }

    return movements;
  }

  async findOne(id, organizationId, inventoryId) {
    await serviceOrganization.verifyOrganization(organizationId);

    const movements = await model.findOne({
      where: { id, organizationId, inventoryId },
    });

    if (!movements) {
      throw error("no movements have found");
    }

    return movements;
  }

  async create(
    organizationId,
    userId,
    inventoryId,
    productId,
    amount,
    typeMoviment
  ) {
    
    await serviceOrganization.verifyOrganization(organizationId);

    const fields = {
      UserId: userId,
      InventoryId: inventoryId,
      ProductId: productId,
      amount: amount,
      typeMoviment: typeMoviment,
    };

    console.log(fields)

    for (const field in fields) {
      if (!fields[field]) {
        throw error(`please set a ${field}!`);
      } else if (field === "typeMoviment") {
        if (!(fields[field] === ("entry" || "exit"))) {
          throw error("please set a valid type movement!");
        }

        } else if (field === "amount") {
          if(isNaN(fields[field])) {
            throw error('invalid amount')
          }
        }
    
      switch(field) {
        case "InventoryId":
            {
                const entity = await serviceInventory.findOne(organizationId, fields[field])
            if(!entity) {
                throw error('Inventory not found')
            }
        }
            break;

        case "UserId":
            {
                const entity = await serviceUser.findOne(organizationId, fields[field])
                if(!entity) {
                    throw error('User not found')
                }
            }
            break;

        case "ProductId": 
            {
                const entity = await serviceProduct.findOne(organizationId, fields[field])
                if(!entity) {
                    throw error('Product not found')
                }
            }

        break
      }
      
    }

    return await model.create({
        organizationId,
        userId,
        inventoryId,
        productId,
        amount,
        typeMoviment
    })
  }
}

module.exports = new InventoryMovement()
