const error = require("../../fns/error.js");
const Repository = require("../../repository/repository.js");
const verifyOrganization = require("../../fns/verifyOrganization.js");
const productModel = require('../../models/Product.js')
const serviceProduct = require('../../services/Product.js')

const repository = new Repository(productModel)

const productService = new serviceProduct(error, repository, verifyOrganization)

module.exports = productService