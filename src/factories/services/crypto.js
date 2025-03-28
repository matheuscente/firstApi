const crypto = require("crypto");
const tokenModule = require("jsonwebtoken");
const hashModule = require("bcrypt");
const error = require("../../fns/error.js");
const Crypto = require('../../services/crypto.js')
const key = process.env.JWT_KEY

const security = new Crypto(
    tokenModule,
    hashModule,
    crypto,
    error,
    key
  );
  
  module.exports = security

