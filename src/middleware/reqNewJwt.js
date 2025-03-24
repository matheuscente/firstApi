const security = require('../services/crypto.js')

async function isReqNewtJwt(req, token, security, error, refreshToken) {
    if (!(req.route.path === "/newJwt")) {
        throw error("token invalid or not provided")
    }

    if(!refreshToken) {
        throw error("token invalid or not provided")
    }
    const isRefreshTokenValid = await security.compare(refreshToken, session.refreshToken)
    if (!session || !session.isValid) {
        throw error("your session as expired, please login again")
    }
    const decoded = security.decodeJwtPayload(token)
    return decoded
}

module.exports = isReqNewtJwt