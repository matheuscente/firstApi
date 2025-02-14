
const model = require('../models/Organization.js')

class ServiceOrganization {
    async findOne(id) {
        if(!id || isNaN(id))  {
            const error = new Error('id incorrect')
            error.code = 1
            throw error
        } 
        const organization =  await model.findByPk(id)

        if(!organization) {
            const error = new Error('no organization in this id')
            error.code = 1
            throw error
            
            
        }
        return organization
    }

    async create(name, address, phone, email) {
        const fields = {
            name: name, 
            address: address, 
            phone: phone, 
            email: email
        }
        for(const fieldName in fields) {
            if(!fields[fieldName]) {
                const error = new Error(`${fieldName} invalid or not provided`)
                error.code = 1
                throw error
            }
        }
        return await model.create({name, address, phone, email})
    }


async delete(id) {
    if(!id || isNaN(id))  {
        const error = new Error('Invalid or not provided ID.')
        error.code = 1
        throw error 
    }
    const organization = await this.findOne(id)
    return await organization.destroy()
}

}

module.exports = new ServiceOrganization()