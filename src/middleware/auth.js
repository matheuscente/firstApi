const serviceUser = require("../services/User.js");
const serviceSession = require("../services/session.js");
const serviceToken = require("../services/refreshToken.js");
const verifyJwt = require("../fns/verifyJwt.js");

function auth(role) {
  return async (req, res, next) => {
    const refreshToken = req.body;
    const token = req.headers["authorization"];

    if (!token || !refreshToken) {
      res.status(400).json({ error: "token invalid or not provided" });
      return;
    }

    const decoded = verifyJwt(token);
    const verify = await serviceUser.verify(decoded.id, decoded.role);

    if (
      decoded === "Token Expired" ||
      decoded === "Token invalid or not provided"
    ) {
      res.status(401).json({ error: decoded });
      return
    }

    if (!verify || (role && role !== decoded.role)) {
      res.status(401).json({ error: "forgot permission" });
      return;
    }

    const session = await serviceSession.findSession(token);

    if (!session) {
      res
        .status(401)
        .json({ errou: "session not found" });
      return;
    } else if(!session.isValid) {
      res.status(401).json({error: 'your session as expired, please login again'})
      
    }

    req.session = decoded;

    next();
  };
}

module.exports = auth;
