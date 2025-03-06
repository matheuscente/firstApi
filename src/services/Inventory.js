const error = require('../fns/error.js')
const modelInventory = require('..//models/Inventory.js')
const modelOrganization = require('../models/Organization.js')
const serviceOrganization = require('./Organization.js')
const serviceMovement = require('./InventoryMovement.js')
const productsReturn = require('../fns/productsReturn.js')


class ServiceInventory {
    
    async findAll(organizationId) {
        const result = []
        await serviceOrganization.verifyOrganization(organizationId)

        const inventories = await modelInventory.findAll({where: {organizationId}, include: modelOrganization})

        if(inventories.length === 0) {
            throw error('no inventories in this organization')
        }

        for(const inventory of inventories) {
            const movements = await serviceMovement.findAll(organizationId, inventory.id)
            const products = productsReturn(movements)
            const inventoryReturn = JSON.parse(JSON.stringify(inventory))
            inventoryReturn.products = products

            result.push(inventoryReturn)
        }

        

        return result
    }

    async findOne(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const inventory = await modelInventory.findOne({where: {organizationId, id}, include: modelOrganization})

        if(!inventory) {
            throw error("no inventories with this id in this organization")
        }

        const movements = await serviceMovement.findAll(organizationId, inventory.id)

        const products = productsReturn(movements)



        return {...inventory.dataValues, products}
    }

    async create(organizationId,name) {
        await serviceOrganization.verifyOrganization(organizationId)

        if(!name) {
            throw error('invalid name or not provided')
        }

        const inventory = await modelInventory.create({name, organizationId})

        return this.findOne(inventory.organizationId, inventory.id)
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