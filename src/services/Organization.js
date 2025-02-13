const error = require('../services/CustomizedError.js')
const model = require('../models/Organization.js')

class ServiceOrganization {
    async findOne(id) {
        if(!id || isNaN(id))  {
            throw new error('Invalid or not provided ID.')
        } 
            return await model.findByPk(id)
    }

    async create(name, address, phone, email) {
        if(!name) {
            throw new error('Invalid or not provided ID')
        } else if (!address){
            throw new error('Invalid or not provided address')
        }  else if (!phone){
            throw new error('Invalid or not provided phone')
        } else if (!email){
            throw new error('Invalid or not provided email')
        } 
        return await model.create({name, address, phone, email})
    }


async delete(id) {
    if(!id || isNaN(id))  {
        throw new error('Invalid or not provided ID.')
    }
    const organization = await this.findOne(id)
    return await organization.destroy()
}

}

module.exports = new ServiceOrganization()