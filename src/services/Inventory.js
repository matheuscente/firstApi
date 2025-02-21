const error = require('./error.js')
const modelInventory = require('..//models/Inventory.js')
const serviceOrganization = require('./Organization.js')

class serviceInventory {
    
    async findAll(organizationId) {

        await serviceOrganization.verifyOrganization(organizationId)

        const inventories = await modelInventory.findAll({where: organizationId})

        if(!inventories) {
            throw error('no inventories in this id')
        }
        return inventories
    }

    async findOne(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const inventory = modelInventory.findOne({where: {organizationId, id}})

        if(!inventory) {
            throw error("no inventories with this id in this organization")
        }

        return inventory
    }

    async create(organizationId,name) {
        await serviceOrganization.verifyOrganization(organizationId)

        if(!name) {
            throw error('invalid name or not provided')
        }

        const inventory = modelInventory.create({name, organizationId})

        return inventory
    }
}