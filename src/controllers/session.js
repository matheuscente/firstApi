const serviceSession = require("../services/token.js")

class ApiSession {
    async setJwt(req, res) {
        try {
            const jwt = req.headers['authorization']
            const token = await serviceSession.setJwt(jwt)
            res.status(200).json({token: token})
        }  catch(err) {
            if (err.code === 1) {
              res.status(400).json({ error: err.message });
            } else {
              console.log(err);
              res.status(400).json({ error: `unknown error` });
            }
          }
    }
}

module.exports = new ApiSession()