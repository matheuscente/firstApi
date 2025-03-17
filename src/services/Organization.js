const model = require("../models/Organization.js");
const serviceUser = require("./User.js");
const error = require("../fns/error.js");
const randomicPass = require("../fns/randomicPass.js");

class ServiceOrganization {


  async findOne(id, transaction) {
    if (!id || isNaN(id)) {
      throw error("id incorrect");
    }
    const organization = await model.findOne({where: {id: TokenId}, transaction})

    if (!organization) {
      throw error("no organization in this id");
    }
    return organization;
  }

  async create(name, address, phone, email, transaction) {
    const fields = {
      name: name,
      address: address,
      phone: phone,
      email: email,
    };
    for (const fieldName in fields) {
      if (!fields[fieldName]) {
        throw error(`${fieldName} invalid or not provided`);
      }
    }

    const organization = await model.create({ name, address, phone, email }, { transaction });
    const password = randomicPass()

    let admin = await serviceUser.create(
      organization.id,
      `Admin ${organization.name}`,
      email,
      password,
      "admin"
    );
    admin = JSON.parse(JSON.stringify(admin));

    admin.password = password;
    delete admin.organization;
    delete admin.organizationId;

    return { ...organization.dataValues, admin };
  }

  async update(id, field, value, transaction) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw error("no organizations in this id");
    } else if (field === "id") {
      throw error("changing the id is not allowed");
    }
    organization[field] = value;
    await organization.save({ transaction });
    return this.findOne(id);
  }

  async delete(id, transaction) {
    if (!id || isNaN(id)) {
      throw error("Invalid or not provided ID.");
    }
    const organization = await this.findOne(id);
    return await organization.destroy({ transaction });
  }
}

module.exports = new ServiceOrganization();
