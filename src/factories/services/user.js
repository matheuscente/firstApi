const error = require("../../fns/error.js");
const verifyOrganization = require("../../fns/verifyOrganization.js");
const serviceSession = require("./session.js");
const repository = require("../../repository/repository.js");
const crypto = require("./crypto.js");
const userModel = require('../../models/User.js')
const ServiceUser = require('../../services/User.js')


const repositoryUser = new repository(userModel);

const serviceUser = new ServiceUser(
  repositoryUser,
  error,
  verifyOrganization,
  serviceSession,
  crypto
);

module.exports = serviceUser