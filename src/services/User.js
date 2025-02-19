const serviceOrganization = require('./Organization.js')
const modelOrganization = require('../models/Organization.js')
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

        const users = await modelUser.findAll({where: {organizationId}})

        if(!users) {
            throw error('no have users in this organization')
        }

        const returnUsers = JSON.parse(JSON.stringify(users))
        for(const user in returnUsers) {
            delete returnUsers[user].password
        }
        return returnUsers
    }

    async findOne(id, organizationId) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("This organization does not exist")
        }

        const user = await modelUser.findOne({where: {organizationId, id},
        include:  modelOrganization})

        if(!user) {
            throw error('no user with this id in this organization')
        }

            const returnUser = JSON.parse(JSON.stringify(user))
            delete returnUser.password
            return returnUser
    }

    async create(organizationId, name, email, password, role) {
        const objVerify = {
            organizationId: organizationId,
            name: name,
            email: email,
            password: password,
            role: role
        }

        for(const item in objVerify) {
            if(!objVerify[item]) {
                throw error(`please give a ${item}`)
            }
        }

        const hashedPass = await bcrypt.hash(password, salt)
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        } 

        else if(role !== "admin" && role !== "employee") {
            throw error("invalid employee")
        }
        const user = await modelUser.create({organizationId, name, email, password: hashedPass, role})

        const returnUser = JSON.parse(JSON.stringify(user))
        delete returnUser.password
        return returnUser
    }

    async update(organizationId,id ,field, value) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        }

       

        const user = await modelUser.findOne({where:{organizationId, id}})

        if(!user) {
            throw error("this user don't exists")
        }

        switch(field) {
            case "name":
                user.name = value
                break;
            
            case "email":
                user.email = value
                break;
            
            case "role":
                if(user.role === "employee" && value === "admin") {
                    throw error("change not allowed")
                }
                if(value !== "admin" && value !== "employee") {
                    throw error("invalid role")
                }
                user.role = value
                break;

            case "password":
                const hashedPass = await bcrypt.hash(value, salt)
                user.password = hashedPass
                break;

            case "organizationId":
                throw error('change not allowed')
            
            
            case "id":
                throw error('change not allowed')
            
            default: 
                throw error('invalid field for modify or not provided')

        }

        await user.save()

        const returnUser = JSON.parse(JSON.stringify(user))
        delete returnUser.password
        return returnUser
    }

    async delete(organizationId, id) {
        if(!this.verifyOrganization(organizationId)) {
            throw error("this organization don't exists")
        }

        const user = await modelUser.findOne({where: {organizationId, id}})

        if(!user) {
            throw error("this user don't exists")
        }

        const returnUser = JSON.parse(JSON.stringify(user))
        delete returnUser.password
        await user.destroy()
        return returnUser

    }
}

module.exports = new ServiceUser()