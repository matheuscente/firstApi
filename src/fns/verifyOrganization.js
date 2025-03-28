const model = require("../models/Organization.js")
const error = require("./error.js")

async function verifyOrganization(id, transaction) {
    const organization = await model.findByPk(id, {transaction});
    if (!organization) {
      throw error("no organization in this id");
    }
  }

  module.exports = verifyOrganization