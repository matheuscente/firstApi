const error = require("../fns/error.js");
const modelToken = require('../models/token.js')
const randomicPass = require("../fns/randomicPass.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config("../config.env");

const key = process.env.JWT_KEY

class Session {
    async add(userId, jwt) {
        let refreshToken = randomicPass() 
        refreshToken = await bcrypt.hash(refreshToken, 10)
        const token = await modelToken.create({refreshToken, jwt, userId})

        if(!token) {
            throw error('something as wrong')
        }

        return {refreshToken, jwt}
    }

    async verifyRefreshToken(token, jwt) {
        const session = await this.findSession(jwt)
        const isRefreshTokenOk = await bcrypt.compare(token, session.refreshToken)

        if(!isRefreshTokenOk || !session) {
            return false
        }

        return true
    }

    async setJwt(oldJwt, newJwt) {
        const session = await this.findSession(oldJwt)
        session.jwt = newJwt
        await session.save()
        const newSession = await this.findSession(newJwt)
        return {jwt} = newSession
    }

    async findSession(jwtToken) {
        const session = await modelToken.findOne({where: {jwtToken}})
       
        return session
    }

}

module.exports = new Session()

