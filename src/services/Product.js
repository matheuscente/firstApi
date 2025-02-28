const error = require('./error.js')
const modelProduct = require('../models/Product.js')
const serviceOrganization = require('./Organization.js')

class ServiceProduct {
    
    async findAll(organizationId) {
        console.log(organizationId)
        await serviceOrganization.verifyOrganization(organizationId)

        const products = await modelProduct.findAll({where: {organizationId}})

        if(products.length === 0) {
            throw error('no products in this organization')
        }
        
        return products
    }

    async findOne(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const product = await modelProduct.findOne({where: {organizationId, id}})

        if(!product) {
            throw error("no products with this id in this organization")
        }

        return product
    }

    async create(organizationId,name, description) {
        await serviceOrganization.verifyOrganization(organizationId)

        if(!name) {
            throw error('invalid name or not provided')
        } else if(!description) {
            throw error('invalid description or not provided')
        }

        const product = await modelProduct.create({name, description, organizationId})

        return product
    }

    async update(organizationId, id, field, value) {
        await serviceOrganization.verifyOrganization(organizationId)

        if(!field) {
            throw error("provide a field to change!")
        }  else if(!value) {
            throw error("no value to change!")
        }

        const product = await this.findOne(organizationId, id)

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

            default: 
            throw error('field not valid')
        }

        return product.save()

    } 
    
    async delete(organizationId, id) {
        await serviceOrganization.verifyOrganization(organizationId)

        const product = await this.findOne(organizationId, id)

        if(!product) {
            throw error('no products in this id')
        }

        return product.destroy()
    }
}

module.exports = new ServiceProduct()