const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config.env" });
const serviceUser = require("../services/User.js");

const key = process.env.JWT_KEY;

function auth(role) {
  return (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
      res.status(400).json({ error: "token invalid or not provided" });
      return;
    }

    jwt.verify(token, key, async (error, decoded) => {
      if (error) {
        res.status(400).json({ error: "token invalid or not provided" });
        return;
      }

      const verify = await serviceUser.verify(decoded.id, decoded.role);

      // verifica se o usuario ainda e existe no banco e, se for passado uma role de autorização, se a role do token de sessão atual corresponde a role exigida
      //por exemplo, se a role passada no paramentro for admin, ele verifica se a role do token é admin


      if (!verify || (role && role !== decoded.role)) {
        res.status(401).json({ error: "forgot permission" });
        return;
      }

      req.session = decoded

      next()
    });
  };
}

module.exports = auth;
