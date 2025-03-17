const modelSession = require('../models/session.js')
const modelToken = require('../models/refreshToken.js')
const serviceToken = require('./refreshToken.js')
const error = require('../fns/error.js')
const bcrypt = require('bcrypt')
const generateJwt = require('jsonwebtoken')
require("dotenv").config();

const key = process.env.JWT_KEY


class Session {

    async create(jwt, refreshTokenId, userId, transaction) {
        const values = { jwt, refreshTokenId, userId };
        const undefinedKey = Object.keys(values).find(key => !values[key]);

        if (undefinedKey) {
            throw error(`${undefinedKey} not defined`)
        }
        const session = await modelSession.create({ jwt, refreshTokenId, userId, isValid: true }, { transaction })

        return session
    }

    async findSession(jwt, transaction) {
        const session = await modelSession.findOne({ where: { jwt }, include: modelToken ,  transaction })

        return session
    }

    async deleteSession(jwt, transaction) {
        const session = await this.findSession(jwt, transaction)
        return session.destroy(transaction)
    }

    async setToken(jwt, token, transaction) {
        const session = await this.findSession(jwt, transaction)
        const refreshToken = session.refreshToken.token
        const isTokenValid = await bcrypt.compare(token, refreshToken)

        if (!isTokenValid) {
            throw error('invalid jwt or refresh token')
        }

        const newToken = await serviceToken.createToken(transaction)
        session.token = newToken[0].id
        await session.save({ transaction })
        return newToken[1]
    }


    async setJwt(jwt, token, user, transaction) {
        const session = await this.findSession(jwt, transaction)
        const refreshToken = session.refreshToken.token
        const isTokenValid = await bcrypt.compare(token, refreshToken)

        if (!isTokenValid) {
            throw error('invalid jwt or refresh token')
        }

        const newJwt = generateJwt(user)

        session.jwt = newJwt
        await session.save({ transaction })
        return newJwt
    }

    async changeValidateSession(jwt, transaction) {
        const session = await modelSession.findOne({ where: { jwt }, transaction })
        session.isValid = false
        return session.save({ transaction })
    }


}

module.exports = new Session()