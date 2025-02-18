const serviceOrganization = require('./Organization.js')
const error = require('./error.js')
const modelUser = require('../models/User.js')
const bcrypt = require("bcrypt")
require('dotenv').config('./config.env')

const salt = 10
class ServiceUser{
    async verifyOrganization(id) {
        const organization = await serviceOrganization.findOne(id)
        if(!organization) {
            return false
        }
        return true
    }

    async findAll(organizationId) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("This organization does not exist")
        }

        const users = await modelUser.findAll({where: organizationId})

        if(!users) {
            throw error('no have users in this organization')
        }
        return users
    }

    async findOne(organizationId, id) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("This organization does not exist")
        }

        const user = modelUser.findOne({where: {organizationId, id}})

        if(!user) {
            throw error('no user with this id in this organization')
        }
    }

    async create(organizationId, name, email, password, role) {
        console.log(salt)
        const hashedPass = await bcrypt.hash(password, salt)
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        } 

        else if(role !== "admin" || role !== "employee") {
            throw error("invalid employee")
        }

        const user = await modelUser.create({organizationId, name, email, hashedPass, role})

        return user
    }

    async update(organizationId,id ,field, value) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        }

        else if(field === "organizationId" || field === "id" ) {
            throw error('change not allowed')
        }

        const user = await this.findOne(organizationId, id)

        if(!user) {
            throw error("this user don't exists")
        }

        if(field === "password") {
            const hashedPass = bcrypt.hash(value, salt)
            user.password = hashedPass
            await user.save()
        }

        user[field] = value
        user.save()

        return this.findOne(organizationId, id)
    }

    async delete(organizationId, id) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        }

        const user = await his.findOne(organizationId, id)

        if(!user) {
            throw error("this user don't exists")
        }

        return user.destroy()

    }
}

module.exports = new ServiceUser()