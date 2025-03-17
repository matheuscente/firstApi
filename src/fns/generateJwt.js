const jwt = require('jsonwebtoken')

const key = process.env.JWT_KEY

function generateJwt(user) {
    return jwt.sign(
        {
          id: user.id,
          organizationId: user.organizationId,
          role: user.role,
        },
        key,
        { expiresIn: 60 * 60 }
      );

}

module.exports = generateJwt