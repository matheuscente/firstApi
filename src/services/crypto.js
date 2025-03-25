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

    decodePayload(token) {
        const parts = token.split('.')
        let payload = parts[1]
        payload = Buffer.from(payload, 'base64').toString('utf-8')
        return JSON.parse(payload)
    }

    generateJwt(payload, exp) {
        return this.tokenModule.sign(
            {...payload},
            key,
            { expiresIn: exp}
        );

    }

    decodePayload(token) {
        const parts = token.split('.');
        let payload = parts[1];
        payload = Buffer.from(payload, 'base64').toString('utf-8');
        return JSON.parse(payload);
    }

      

    verifyJwt(token) {
        let decoded
        try {
            decoded = this.tokenModule.verify(token, key)
            return {
                isValid: true,
                decoded
            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return {
                    isValid: false,
                    decoded: 'tokenExpired'
                }
            }
            return {
                isValid: false,
                decoded: "tokenInvalid"
            }
        }
    }
}

module.exports = new Crypto(jwt, bcrypt, crypto)