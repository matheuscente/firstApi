const error = require('./error.js')
const modelInventory = require('..//models/Inventory.js')
const serviceOrganization = require('./Organization.js')

class ServiceInventory {
    
    async findAll(organizationId) {

        await serviceOrganization.verifyOrganization(organizationId)

        const inventories = await modelInventory.findAll({where: {organizationId}})

        if(inventories.length === 0) {
            throw error('no inventories in this organization')
        }
        
        return inventories
    }

    async findOne(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const inventory = await modelInventory.findOne({where: {organizationId, id}})

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

    async update(organizationId, id, newName) {
        await serviceOrganization.verifyOrganization(organizationId)

        if(!newName) {
            throw error("invalid name or not provided")
        }

        const inventory = await this.findOne(organizationId, id)

        if(!inventory) {
            throw error('no inventories in this id')
        }

        inventory.name = newName

        return inventory.save()

    } 
    
    async delete(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const inventory = await this.findOne(organizationId, id)

        if(!inventory) {
            throw error('no inveentories in this id')
        }

        return inventory.destroy()
    }
}

module.exports = new ServiceInventory()