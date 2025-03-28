class ServiceProduct { 
  constructor(error, repository, verifyOrganization) {
    this.error = error
    this.repository = repository
    this.verifyOrganization = verifyOrganization
  }
  async findAll(organizationId, transaction) {
    await this.verifyOrganization(organizationId, transaction);

    const products = await this.repository.findAll({ organizationId },transaction);

    if (products.length === 0) {
      throw this.error("no products in this organization");
    }

    return products;
  }

  async findOne(organizationId, id, transaction) {
    await this.verifyOrganization(organizationId, transaction);

    const product = await this.repository.findOne({ organizationId, id }, transaction);

    if (!product) {
      throw this.error("no products with this id in this organization");
    }

    return product;
  }

  async create(organizationId, name, description, transaction) {
    await this.verifyOrganization(organizationId, transaction);

    if (!name) {
      throw this.error("invalid name or not provided");
    } else if (!description) {
      throw this.error("invalid description or not provided");
    }

    return await this.repository.create({
      name,
      description,
      organizationId,
    },transaction);
  }

  async update(product, field, value, transaction) {
    if (!product) {
      throw this.error("invalid product");
    }

    if (!(field === "name" || field === "description")) {
      throw this.error("field invalid or not provided");
    } else if (!value) {
      throw this.error("no value to change!");
    }

    return await this.repository.update(product, field, value, transaction)
  }

  async delete(product, transaction) {
    if (!product) {
      throw this.error("invalid product");
    }
    return this.repository.delete(product, transaction)
  }
}

module.exports = ServiceProduct
