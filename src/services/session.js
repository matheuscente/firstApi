const modelSession = require('../models/session.js')
const modelToken = require('../models/refreshToken.js')
const error = require('../fns/error.js')
const bcrypt = require('bcrypt')
const generateJwt = require('jsonwebtoken')
require("dotenv").config();

const key = process.env.JWT_KEY


class Session {

    async create(jwt, refreshTokenId, userId) {
        const values = { jwt, refreshTokenId, userId };
        const undefinedKey = Object.keys(values).find(key => !values[key]);

        if (undefinedKey) {
            throw error(`${undefinedKey} not defined`)
        }
        const session = await modelSession.create({ jwt, refreshTokenId, userId, isValid: true})

        return session
    }

    async findSession(jwt) {
        const session = await modelSession.findOne({where: {jwt}, include: modelToken})

        return session
    }

    async deleteSession(jwt) {
        const session = await this.findSession(jwt)
        return session.destroy()
    }

    async setJwt(jwt, token, user) {
        const session = await this.findSession(jwt)
        const refreshToken = session.refreshToken.token
    const isTokenValid = await bcrypt.compare(token, refreshToken)

    if(!isTokenValid) {
      throw error('invalid jwt or refresh token')
    }

    const newJwt = generateJwt.sign(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      key,
      { expiresIn: 60 * 60 }
    );

    session.jwt = newJwt
    await session.save()
    return newJwt
    }

    async changeValidateSession(jwt) {
        const session = await modelSession.findOne({where: {jwt}})
        session.isValid = false
        return session.save()
    }


}

module.exports = new Session()