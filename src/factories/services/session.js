const error = require("../../fns/error.js");
const repository = require("../../repository/repository.js");
const crypto = require("./crypto.js");
const sessionModel = require('../../models/session.js')
const ServiceSession = require('../../services/session.js')

const repositorySession = new repository(sessionModel);

const serviceSession = new ServiceSession(
  repositorySession,
  crypto,
  error,
  
);

module.exports = serviceSession