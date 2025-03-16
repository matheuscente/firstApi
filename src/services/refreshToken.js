const error = require("../fns/error.js");
const modelToken = require('../models/refreshToken.js')
const randomicPass = require("../fns/randomicPass.js");
const bcrypt = require('bcrypt');

require("dotenv").config("../config.env");


class RefreshToken {
    async findToken(TokenId, transaction) {
        const token = await modelToken.findByPk(TokenId, {transaction})
        if(!token) {
            throw error('refresh Token not found or not provided')
        }

        return token
    }

    async createToken(transaction) {
        const token = randomicPass()
        const hashedToken = await bcrypt.hash(token, 10)

        return  [await modelToken.create({token: hashedToken}, {transaction}), token]
    }

    async deleteToken(tokenId, transaction) {
        const token = await this.findToken(tokenId, transaction)
        if(!token) {
            throw error('refresh Token not found or not provided')
        }

        return token.destroy()
    } 
}

module.exports = new RefreshToken()

