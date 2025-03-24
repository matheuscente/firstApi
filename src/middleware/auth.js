const security = require("../services/crypto.js");
const serviceUser = require("../services/User.js");
const serviceSession = require("../services/session.js")
const isReqNewtJwt = require('./reqNewJwt.js')

const key = process.env.JWT_KEY;

function auth(role) {
  return async (req, res, next) => {
    const refreshToken = req.body;
    const token = req.headers["authorization"];

    if (!token) {
      res.status(400).json({ error: "token invalid or not provided" });
      return;
    }

    let decoded = security.verifyJwt(token)
    if (!decoded.isValid) {
      if (decoded.decoded === "tokenExpired") {
        try {
          decoded = isReqNewtJwt(req, token, security, error, refreshToken)
        } catch (err) {
          res.status(401).json({ error: err.message })
          return
        }
      }

      res.status(401).json({ error: 'token invalid or not provided' })
      return


    }
    const verify = await serviceUser.verify(decoded.id, decoded.role);

    // verifica se o usuario ainda e existe no banco e, se for passado uma role de autorização, se a role do token de sessão atual corresponde a role exigida
    //por exemplo, se a role passada no paramentro for admin, ele verifica se a role do token é admin

    if (!verify || (role && role !== decoded.role)) {
      res.status(401).json({ error: "forgot permission" });
      return;
    }

    const session = await serviceSession.findSession(token)


    if (!session || !session.isValid) {
      res.status(401).json({ error: "your session as expired, please login again" })
      return
    }



    req.session = decoded;

    next();
  };
}

module.exports = auth;
