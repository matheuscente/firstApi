const serviceUser = require("../services/user.js");
const serviceSession = require("../services/session.js")
const security = require('../services/crypto.js')
const serviceMiddleware = require('../../middleware/middleware.js')

const middleware = new serviceMiddleware(
    serviceUser,
    serviceSession,
    security
  );

  module.exports = middleware