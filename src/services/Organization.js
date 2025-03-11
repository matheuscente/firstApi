const model = require("../models/Organization.js");
const serviceUser = require("./User.js");
const error = require("../fns/error.js");
const bcrypt = require("bcrypt");
const randomicPass = require("../fns/randomicPass.js");

class ServiceOrganization {


  async findOne(id) {
    if (!id || isNaN(id)) {
      throw error("id incorrect");
    }
    const organization = await model.findByPk(id);

    if (!organization) {
      throw error("no organization in this id");
    }
    return organization;
  }

  async create(name, address, phone, email) {
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

    const organization = await model.create({ name, address, phone, email });
    const password = randomicPass();
    const encryptedpass = await bcrypt.hash(password, 10);

    let admin = await serviceUser.create(
      organization.id,
      `Admin ${organization.name}`,
      email,
      encryptedpass,
      "admin"
    );
    admin = JSON.parse(JSON.stringify(admin));

    admin.password = password;
    delete admin.organization;
    delete admin.organizationId;

    return { ...organization.dataValues, admin };
  }

  async update(id, field, value) {
    const organization = await this.findOne(id);
    if (!organization) {
      throw error("no organizations in this id");
    } else if (field === "id") {
      throw error("changing the id is not allowed");
    }
    organization[field] = value;
    await organization.save();
    return this.findOne(id);
  }

  async delete(id) {
    if (!id || isNaN(id)) {
      throw error("Invalid or not provided ID.");
    }
    const organization = await this.findOne(id);
    return await organization.destroy();
  }
}

module.exports = new ServiceOrganization();
