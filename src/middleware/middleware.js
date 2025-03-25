const serviceUser = require("../services/User.js");
const serviceSession = require("../services/session.js")
const security = require('../services/crypto.js')

class middleware {
  constructor(serviceUser, serviceSession, security) {
    this.serviceUser = serviceUser
    this.serviceSession = serviceSession
    this.security = security
  }
  auth(role) {
    return async (req, res, next) => {
      const {refreshToken} = req.body;
      const token = req.headers["authorization"];
      console.log(token, refreshToken)

      if (!token || !refreshToken) {
        res.status(401).json({ error: "token invalid or not provided" });
        return;
      }

      const isJwtValid = this.security.verifyJwt(token)
      const session = await this.serviceSession.findSession(token)

      if (!isJwtValid.isValid) {
        res.status(401).json({ error: "token invalid or not provided" });
        return;
      }

      const verify = await this.serviceUser.verify(isJwtValid.decoded.id, isJwtValid.decoded.role);

      if (!verify || (role && role !== isJwtValid.decoded.role)) {
        res.status(401).json({ error: "forgot permission" });
        return;
      }

      if (!session || !session.dataValues.isValid) {
        console.log(session, session.dataValues.isValid)
        res.status(401).json({ error: "your session as expired, please login again" })
        return
      }
      req.session = isJwtValid.decoded;

      next();
    }
  };

  authNewJwt(role) {
    return async (req, res, next) => {
      const {refreshToken} = req.body;
      const token = req.headers["authorization"];

      if (!token || !refreshToken) {
        res.status(401).json({ error: "token invalid or not provided" });
        return;
      }

      const isJwtValid = this.security.verifyJwt(token)
      const session = await this.serviceSession.findSession(token)
      const sessionRefreshToken = await this.serviceSession.getRefreshToken(session)
      if (isJwtValid.isValid) {
        res.status(401).json({ error: "for gerenerate a new token, the atual token need to be invalid" });
        return
      }
      if (isJwtValid.decoded === 'tokenExpired') {
        if (req.route.path === "/newJwt") {
          const isRefreshTokenValid = await this.security.compare(refreshToken, sessionRefreshToken)
          if (!isRefreshTokenValid) {
            res.status(401).json({ error: "token invalid or not provided" });
            return;
          }
          const isSessionValid = await this.serviceSession.isSessionValid(session)
          if (!isSessionValid) {
            res.status(401).json({ error: "invalid session" });
            return
          }
          const payload = this.security.decodePayload(token)
          const verify = await this.serviceUser.verify(payload.id, payload.role)
          if (!verify || (role && role !== payload.role)) {
            res.status(401).json({ error: "forgot permission" });
            return;
          }
          next()
        }
      }
      res.status(401).json({ error: "token invalid or not provided" });
      return
    }
  }
}

module.exports = new middleware(serviceUser, serviceSession, security)