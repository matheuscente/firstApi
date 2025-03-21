const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const error = require('../fns/error.js')

const key = process.env.JWT_KEY

class Crypto {
    constructor(tokenModule, hashModule, crypto) {
        this.tokenModule = tokenModule
        this.hashModule = hashModule
        this.crypto = crypto
    }

    async hash(password, salt) {
        if(!password) {
            throw error('password undefined')
        } else if(!salt) {
            throw new Error('salt undefined')
        }

        return this.hashModule.hash(password, salt)
    }

    async compare(string, hashedPass) {
        if(!string) {
            throw error('password undefined')
        } else if(!hashedPass) {
            throw new Error('hashedPass undefined')
        }

        return this.hashModule.compare(string, hashedPass)
    }



    randomicPass() {
        return this.crypto.randomBytes(10).toString('hex')
    }

    generateJwt(user) {
        return this.tokenModule.sign(
            {
                id: user.id,
                organizationId: user.organizationId,
                role: user.role,
            },
            key,
            { expiresIn: 60 * 60 }
        );

    }

    verifyJwt(token) {
        let decoded
        try {
            decoded = this.tokenModule.verify(token, key)
            return decoded
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return 'Token Expired'
            }
            return 'Token invalid or not provided'
        }
    }
}

module.exports = new Crypto(jwt, bcrypt, crypto)