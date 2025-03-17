const error = require("../fns/error.js");
const modelProduct = require("../models/Product.js");
const modelOrganization = require("../models/Organization.js");
const verifyOrganization = require("../fns/verifyOrganization.js");

class ServiceProduct {
  async findAll(organizationId, transaction) {
    await verifyOrganization(organizationId, transaction);

    const products = await modelProduct.findAll({
      where: { organizationId },
      include: modelOrganization,  transaction });

    if (products.length === 0) {
      throw error("no products in this organization");
    }

    return products;
  }

  async findOne(organizationId, id, transaction) {
    await verifyOrganization(organizationId, transaction);

    const product = await modelProduct.findOne({
      where: { organizationId, id },
      include: modelOrganization, transaction });

    if (!product) {
      throw error("no products with this id in this organization");
    }

    return product;
  }

  async create(organizationId, name, description, transaction) {
    await verifyOrganization(organizationId, transaction);

    if (!name) {
      throw error("invalid name or not provided");
    } else if (!description) {
      throw error("invalid description or not provided");
    }

    const product = await modelProduct.create({
      name,
      description,
      organizationId,
    }, { transaction });

    return this.findOne(product.organizationId, product.id, transaction);
  }

  async update(organizationId, id, field, value, transaction) {
    await verifyOrganization(organizationId, transaction);

    if (!field) {
      throw error("provide a field to change!");
    } else if (!value) {
      throw error("no value to change!");
    }

    const product = await this.findOne(organizationId, id, transaction);

    if (!product) {
      throw error("no products in this id");
    }

    switch (field) {
      case "name":
        product.name = value;
        break;

      case "description":
        product.description = value;
        break;

      default:
        throw error("field not valid");
    }

    return product.save({ transaction });
  }

  async delete(organizationId, id, transaction) {
    await verifyOrganization(organizationId, transaction);

    const product = await this.findOne(organizationId, id, transaction);

    if (!product) {
      throw error("no products in this id");
    }

    return product.destroy({ transaction });
  }
}

module.exports = new ServiceProduct();
