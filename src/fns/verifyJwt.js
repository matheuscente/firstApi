const jwt = require('jsonwebtoken')

const key = process.env.JWT_KEY;

function verifyJwt(token) {
    let decoded
    try {
        decoded = jwt.verify(token, key)
        return decoded
    } catch(err) {
        if(err instanceof jwt.TokenExpiredError) {
            return 'Token Expired' 
        }
        return 'Token invalid or not provided'
    }
}

module.exports = verifyJwt