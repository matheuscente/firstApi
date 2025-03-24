const error = require("../fns/error.js");
const repository = require('../repository/repository.js')
const security = require("./crypto.js")

require("dotenv").config("../config.env");


class RefreshToken {
    constructor(repository) {
        this.repository = repository
    }
    async findToken(tokenId, transaction) {
        const token = await this.repository.findOne({id: tokenId}, transaction)
        if (!token) {
            throw error('refresh Token not found or not provided')
        }

        return token
    }

    async createToken(transaction) {
        const token = security.randomicPass()
        const hashedToken = await security.hash(token, 10)
        const refreshToken = await this.repository.create({ token: hashedToken }, transaction )

        return { id: refreshToken.id, token: token, created: refreshToken.createdAt }
    }

    async deleteToken(tokenId, transaction) {
        const token = await this.findToken(tokenId, transaction)
        if (!token) {
            throw error('refresh Token not found or not provided')
        }

        return this.repository.delete(token, transaction )
    }

    
 isTokenValid(date, currentDate) {
    let dateCreate = date
    const day = 86400000
    let validate = day * 7
    dateCreate = dateCreate.getTime()
    validate = dateCreate + validate

    return validate > currentDate
}
}

module.exports = new RefreshToken(new repository(require('../models/refreshToken.js')))