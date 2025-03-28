const repository = require("../../repository/repository.js");
const serviceUser = require("./user.js");
const error = require("../../fns/error.js");
const crypto = require("./crypto.js");
const OrganizationModel = require("../../models/Organization.js");
const ServiceOrganization = require('../../services/Organization.js')

const repositoryOrganization = new repository(OrganizationModel);

const serviceOrganization = new ServiceOrganization(
  error,
  serviceUser,
  repositoryOrganization,
  crypto
);

module.exports = serviceOrganization