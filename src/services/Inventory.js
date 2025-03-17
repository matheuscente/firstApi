const error = require("../fns/error.js");
const modelInventory = require("..//models/Inventory.js");
const modelOrganization = require("../models/Organization.js");
const serviceMovement = require("./InventoryMovement.js");
const productsReturn = require("../fns/productsReturn.js");
const verifyOrganization = require("../fns/verifyOrganization.js");

class ServiceInventory {
  async findAll(organizationId, transaction) {
    const result = [];
    await verifyOrganization(organizationId, transaction);

    const inventories = await modelInventory.findAll({
      where: { organizationId },
      include: modelOrganization
    ,  transaction });

    if (inventories.length === 0) {
      throw error("no inventories in this organization");
    }

    for (const inventory of inventories) {
      const movements = await serviceMovement.findAll(
        organizationId,
        inventory.id,
        transaction
      );
      const products = productsReturn(movements);
      const inventoryReturn = JSON.parse(JSON.stringify(inventory));
      inventoryReturn.products = products;

      result.push(inventoryReturn);
    }

    return result;
  }

  async findOne(organizationId, id, transaction) {
    await verifyOrganization(organizationId, transaction);

    const inventory = await modelInventory.findOne({
      where: { organizationId, id },
      include: modelOrganization,
     transaction });

    if (!inventory) {
      throw error("no inventories with this id in this organization");
    }

    const movements = await serviceMovement.findAll(
      organizationId,
      inventory.id,
      transaction
    );

    const products = productsReturn(movements);

    return { ...inventory.dataValues, products };
  }

  async create(organizationId, name, transaction) {
    await verifyOrganization(organizationId, transaction);

    if (!name) {
      throw error("invalid name or not provided");
    }

    const inventory = await modelInventory.create({ name, organizationId }, {transaction});

    return this.findOne(inventory.organizationId, inventory.id, transaction);
  }

  async update(organizationId, id, newName, transaction) {
    await verifyOrganization(organizationId, transaction);

    if (!newName) {
      throw error("invalid name or not provided");
    }

    const inventory = await this.findOne(organizationId, id, transaction);

    if (!inventory) {
      throw error("no inventories in this id");
    }

    inventory.name = newName;

    return inventory.save({ transaction });
  }

  async delete(organizationId, id, transaction) {
    await verifyOrganization(organizationId, transaction);

    const inventory = await this.findOne(organizationId, id, transaction);

    if (!inventory) {
      throw error("no inveentories in this id");
    }

    return inventory.destroy({ transaction });
  }
}

module.exports = new ServiceInventory();
