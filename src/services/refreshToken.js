const error = require("../fns/error.js");
const modelToken = require('../models/refreshToken.js')
const security = require("./crypto.js")

require("dotenv").config("../config.env");


class RefreshToken {
    async findToken(tokenId, transaction) {
        const token = await modelToken.findOne({where: {id: tokenId}, transaction})
        if (!token) {
            throw error('refresh Token not found or not provided')
        }

        return token
    }

    async createToken(transaction) {
        const token = security.randomicPass()
        const hashedToken = await security.hash(token, 10)
        const refreshToken = await modelToken.create({ token: hashedToken }, { transaction })

        return [refreshToken, { token: token, created: refreshToken.createdAt }]
    }

    async deleteToken(tokenId, transaction) {
        const token = await this.findToken(tokenId, transaction)
        if (!token) {
            throw error('refresh Token not found or not provided')
        }

        return token.destroy({ transaction })
    }
}

module.exports = new RefreshToken()

