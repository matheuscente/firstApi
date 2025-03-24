
const serviceToken = require("./refreshToken.js");
const error = require("../fns/error.js");
const repository = require('../repository/repository.js')
const crypto = require('../services/crypto.js')
const modelSession = require('../models/session.js')


class Session { 
  constructor (repository, serviceToken, crypto) {
    this.repository = new repository(require('../models/session.js'), require('../models/refreshToken.js'))
    this.serviceToken = serviceToken,
    this.security = crypto

  }
  async create(jwt, refreshTokenId, userId , transaction) {
    if(!refreshTokenId) {
      throw error('invalid refresh token')
    } else if(!userId) {
      throw error('invalid user')
    }

    const isJwtValid = await this.security.verifyJwt(jwt)
    if(!isJwtValid.isValid) {
      throw error('token invalid or not provided')
    }

    try {
      const session = await modelSession.create(
        { jwt, refreshTokenId, userId, isValid: true },
        { transaction }
      );
      return session;
    } catch (err) {
      console.log(err);
    }
  }

  async findSession(jwt, transaction) {
    const session = await modelSession.findOne({where: {jwt}
    ,
    transaction,}
    );

    return session;
  }

  async deleteSession(jwt, transaction) {
    const session = await this.findSession(jwt, transaction);
    return session.destroy(transaction);
  }

  async setToken(jwt, token, transaction) {
    const session = await this.findSession(jwt, transaction);
    const refreshToken = session.refreshToken.token;
    const isTokenValid = await this.security.compare(token, refreshToken);

    if (!isTokenValid) {
      throw error("invalid jwt or refresh token");
    }

    const newToken = await this.serviceToken.createToken(transaction);
    session.token = newToken[0].id;
    await session.save({ transaction });
    return newToken[1];
  }

  async setJwt(session, token, transaction) {
    if(!session) {
      throw error("invalid session")
    } else if(!token) {
      throw error("invalid token")
    }

    session.jwt = token;
    await session.save({ transaction });
    return token;
  }

  async changeValidateSession(jwt,validate, transaction) {
    const session = await modelSession.findOne({ where: { jwt }, transaction });
    if(!session) {
      throw error("session invalid");
    }
    session.isValid = validate;
    return session.save({ transaction });
  }

  async validateSession(session, currentDate, transaction) {
    if (!session) {
      return false;
    }

    const validadteToken = this.serviceToken.isTokenValid(session.refreshToken.createdAt, currentDate);

    if (!session.isValid) {
      return false;
    }

    if (!validadteToken) {
      session.isValid = false;
      await session.save({transaction})
      return false;
    }

    return true;
  }
}

module.exports = new Session(repository, serviceToken, crypto);