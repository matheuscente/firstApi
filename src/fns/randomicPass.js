const crypto = require('crypto')

function randomicPass() {
    return crypto.randomBytes(10).toString('hex')
}

module.exports = randomicPass