
class ServiceInventory {
  constructor(repository, serviceMovement, productsReturn, verifyOrganization, error) {
    this.repository = repository,
    this.serviceMovement = serviceMovement,
    this.productsReturn = productsReturn,
    this.verifyOrganization = verifyOrganization,
    this.error = error
  }
  async findAll(organizationId, transaction) {
    await this.verifyOrganization(organizationId, transaction);

    const inventories = await this.repository.findAll({organizationId }, transaction);

    if (inventories.length === 0) {
      throw this.error("no inventories in this organization");
    }

    const inventoryPromises = inventories.map(async (inventory) => {
      const movements = await this.serviceMovement.findAll(
        organizationId,
        inventory.id,
        transaction
      );
      const products = this.productsReturn(movements);
      const inventoryWithProducts = {...inventory.dataValues, products};
      return inventoryWithProducts
    })
    return Promise.all(inventoryPromises);
  }

  async findOne(organizationId, id, transaction) {
    await this.verifyOrganization(organizationId, transaction);

    const inventory = await this.repository.findOne({ organizationId, id }, transaction);

    if (!inventory) {
      throw error("no inventories with this id in this organization");
    }

    const movements = await this.serviceMovement.findAll(
      organizationId,
      inventory.id,
      transaction
    );

    const products = this.productsReturn(movements);

    return { ...inventory.dataValues, products };
  }

  async create(organizationId, name, transaction) {
    if (!name) {
      throw this.error("invalid name or not provided");
    }
    await this.verifyOrganization(organizationId, transaction);

    const inventory = await this.repository.create({ name, organizationId }, transaction);

    return inventory
  }

  async update(inventory, newName, transaction) {
    if (!newName) {
      throw this.error("invalid name or not provided");
    }

    if (!inventory.id) {
      throw this.error("invalid inventory");
    }

    await this.verifyOrganization(organizationId, transaction);

    return this.repository.update(inventory, 'name', newName, transaction);
  }

  async delete(inventory, transaction) {

    if (!inventory.id) {
      throw this.error("invalid inventory");
    }

    await this.verifyOrganization(organizationId, transaction);

    return this.repository.delete(inventory, transaction);
  }
}

module.exports = ServiceInventory
