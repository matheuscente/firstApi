const serviceUser = require("./User.js");
const modelUser = require('../models/User.js')
const error = require("../fns/error.js");
const randomicPass = require("../fns/randomicPass.js");
const Organization = require("../models/Organization.js");

class ServiceOrganization {
  constructor(model, modelUser, randomicPass, error, serviceUser) {
    this.model = model
    this.modelUser = modelUser
    this.randomicPass = randomicPass
    this.error = error
    this.serviceUser = serviceUser
  }

  async findOne(id, transaction) {
    if (!id || isNaN(id)) {
      throw error("id incorrect");
    }
    const organization = await this.model.findOne({where: {id}, transaction})

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
    
    const organization = await this.model.create({ name, address, phone, email }, { transaction });
    const password = randomicPass()

    let admin = await serviceUser.create(
      organization.id,
      `Admin ${organization.name}`,
      email,
      password,
      "admin",
      transaction
    );
    admin = JSON.parse(JSON.stringify(admin));

    admin.password = password;
    delete admin.organization;
    delete admin.organizationId;

    return { ...organization.dataValues, admin };
  }

  async update(id, field, value, transaction) {
    if(!value) {
      throw error('set a value to modification')
    } else if(!field) {
      throw error('set a field to modification')
    }else if (field === "id") {
      throw error("changing the id is not allowed");
    }
    const fields = ['name', 'address', 'phone', 'email']
    const isFieldValid = fields.includes(field)
    if(!isFieldValid) {
      throw error('field not valid')
    }
    const organization = await this.findOne(id, transaction);
    if (!organization) {
      throw error("no organizations in this id");
    }
    organization[field] = value;
    await organization.save({ transaction });
    return this.findOne(id, transaction);
  }

  async delete(id, transaction) {
    if (!id || isNaN(id)) {
      throw error("Invalid or not provided ID.");
    }
    const organization = await this.findOne(id, transaction);
    await modelUser.destroy({where: {organizationId: organization.id}, transaction})
    return organization.destroy({transaction})
  }
}

module.exports = new ServiceOrganization(Organization, modelUser, randomicPass, error, serviceUser);
