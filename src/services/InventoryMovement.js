const model = require("../models/InventoryMovement.js");
const serviceOrganization = require("./Organization.js");
const error = require("../fns/error.js");
const serviceProduct = require("../services/Product.js");
const serviceUser = require("../services/User.js");
const serviceInventory = require("../services/Inventory.js");
const modelOrganization = require("../models/Organization.js");
const modelProduct = require("../models/Product.js");
const modelUser = require("../models/User.js");
const modelInventory = require("../models/Inventory.js");
const productsReturn = require("../fns/productsReturn.js");

class InventoryMovement {
  async findAll(organizationId, inventoryId) {
    await serviceOrganization.verifyOrganization(organizationId);

    const inventory = await modelInventory.findAll({
      where: { organizationId, id: inventoryId },
    });

    if (!inventory) {
      throw error("no inventory has found");
    }

    const movements = await model.findAll({
      where: { inventoryId, organizationId },
      include: [
        { model: modelInventory },
        { model: modelOrganization },
        { model: modelProduct },
        { model: modelUser },
      ],
    });

    let movementsExtract = JSON.parse(JSON.stringify(movements));

    movementsExtract.forEach((item) => {
      delete item.userId;
      delete item.productId;
      delete item.inventoryId;
      delete item.organizationId;
      delete item.user.password;
    });
    return movementsExtract;
  }

  async findOne(id, organizationId, inventoryId) {
    await serviceOrganization.verifyOrganization(organizationId);

    if (!id) {
      throw error("please set a id");
    } else if (!organizationId) {
      throw error("please set a organizationId");
    } else if (!inventoryId) {
      throw error("please set a inventoryId");
    }

    const movements = await model.findOne({
      where: { id, organizationId, inventoryId },
      include: [
        { model: modelInventory },
        { model: modelOrganization },
        { model: modelProduct },
        { model: modelUser },
      ],
    });

    if (!movements) {
      throw error("no movements have found");
    }

    let movementsExtract = JSON.parse(JSON.stringify(movements));

    delete movementsExtract.userId;
    delete movementsExtract.productId;
    delete movementsExtract.inventoryId;
    delete movementsExtract.organizationId;
    delete movementsExtract.user.password;

    return movementsExtract;
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

    for (const field in fields) {
      if (!fields[field]) {
        throw error(`please set a ${field}!`);
      } else if (field === "typeMoviment") {
        if (fields[field] !== "entry" && fields[field] !== "out") {
          throw error("please set a valid type movement!");
        }
      } else if (field === "amount") {
        if (isNaN(fields[field]) || fields[field] < 0) {
          throw error("invalid amount");
        }
      }

      switch (field) {
        case "InventoryId":
          {
            const value = fields[field];
            const entity = await modelInventory.findOne({
              where: { organizationId, id: value },
            });
            if (!entity) {
              throw error("Inventory not found");
            }
          }
          break;

        case "UserId":
          {
            const entity = await serviceUser.findOne(
              organizationId,
              fields[field]
            );
            if (!entity) {
              throw error("User not found");
            }
          }
          break;

        case "ProductId":
          {
            const entity = await serviceProduct.findOne(
              organizationId,
              fields[field]
            );
            if (!entity) {
              throw error("Product not found");
            }
          }

          break;
      }
    }

    const allMovements = await this.findAll(organizationId, inventoryId);

    const products = productsReturn(allMovements);
    console.log(products);

    if (typeMoviment === "out") {
      const haveProduct = products.find((product) => product.id === productId);
      if (!haveProduct || haveProduct.amount - amount < 0) {
        throw error(
          "There is not enough quantity of this product in this inventory"
        );
      }
    }

    const movements = await model.create({
      organizationId,
      userId,
      inventoryId,
      productId,
      amount,
      typeMoviment,
    });

    return this.findOne(
      movements.id,
      movements.organizationId,
      movements.inventoryId
    );
  }

  async update(organizationId, id, inventoryId, field, value) {
    await serviceOrganization.verifyOrganization(organizationId);

    const movement = await model.findOne({
      where: { organizationId, id, inventoryId },
    });

    if (!movement) {
      throw error("movement not found");
    } else if (!value) {
      throw error(`please provide the ${field} to modification`);
    }

    switch (field) {
      case "userId":
        const user = await serviceUser.findOne(organizationId, value);

        if (!user) {
          throw error("user not found");
        }

        movement.userId = value;
        break;

      case "productId":
        const product = await serviceProduct.findOne(organizationId, value);

        if (!product) {
          throw error("product not found");
        }

        movement.productId = value;
        break;

      case "amount":
        movement.amount = value;
        break;

      case "typeMovement":
        if (!(value === "out" || value === "entry")) {
          throw error("invalid type movement");
        }

        movement.typeMoviment = value;
        break;

      case "inventoryId":
        const inventory = await modelInventory.findOne({
          where: { organizationId, id: value },
        });

        if (!inventory) {
          throw error("inventory not found");
        }

        movement.inventoryId = value;
        await movement.save();

        return this.findOne(id, organizationId, value);

      default:
        throw error(`please provide a valid field to modification`);
    }

    return this.findOne(id, organizationId, inventoryId);
  }
  async delete(organizationId, inventoryId, movementId) {
    await serviceOrganization.verifyOrganization(organizationId);

    const deletedMovement = await model.findOne({
      where: { organizationId, inventoryId, id: movementId },
    });

    if (!deletedMovement) {
      throw error("movimentation not found");
    }

    const movement = await this.findOne(
      movementId,
      organizationId,
      inventoryId
    );

    await deletedMovement.destroy();

    return movement;
  }
}

module.exports = new InventoryMovement();
