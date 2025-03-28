const error = require("../../fns/error.js");
const serviceMovement = require("./InventoryMovement.js");
const productsReturn = require("../../fns/productsReturn.js");
const verifyOrganization = require("../../fns/verifyOrganization.js");
const Repository = require('../../repository/repository.js')
const inventoryModel = require('../../models/Inventory.js')
const InventoryService = require('../../services/Inventory.js')

const inventoryRepository  = new Repository(inventoryModel)

const inventoryService = new InventoryService(inventoryRepository, serviceMovement, productsReturn, verifyOrganization, error)

module.exports = inventoryService



