const error = require('./error.js')
const modelProduct = require('..//models/product.js')
const serviceOrganization = require('./Organization.js')

class ServiceProduct {
    
    async findAll(oganizationId) {

        await serviceOrganization.verifyOrganization(oganizationId)

        const products = await modelProduct.findAll({where: oganizationId})

        if(products.length === 0) {
            throw error('no products in this organization')
        }
        
        return products
    }

    async findOne(oganizationId, id) {
        await serviceOrganization.verifyOrganization(oganizationId)

        const product = await modelProduct.findOne({where: {oganizationId, id}})

        if(!product) {
            throw error("no products with this id in this organization")
        }

        return product
    }

    async create(oganizationId,name, description) {
        await serviceOrganization.verifyOrganization(oganizationId)

        if(!name) {
            throw error('invalid name or not provided')
        } else if(!description) {
            throw error('invalid description or not provided')
        }

        const product = await modelProduct.create({oganizationId, name, description})

        return product
    }

    async update(oganizationId, id, field, value) {
        await serviceOrganization.verifyOrganization(oganizationId)

        if(!field) {
            throw error("provide a field to change!")
        }  else if(!value) {
            throw error("no value to change!")
        }

        const product = await this.findOne(oganizationId, id)

        if(!product) {
            throw error('no products in this id')
        }

        switch(field) {
            case "name":
                product.name = value
                break
            
            case "description":
                product.description = value
                break
        }

        return product.save()

    } 
    
    async delete(oganizationId, id) {
        await serviceOrganization.verifyOrganization(oganizationId)

        const product = await this.findOne(oganizationId, id)

        if(!product) {
            throw error('no inveentories in this id')
        }

        return product.destroy()
    }
}

module.exports = new ServiceProduct()