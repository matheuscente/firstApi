const modelSession = require("../models/session.js");
const modelToken = require("../models/refreshToken.js");
const serviceToken = require("./refreshToken.js");
const error = require("../fns/error.js");
const bcrypt = require("bcrypt");
const generateJwt = require("jsonwebtoken");
require("dotenv").config();
const isTokenValid = require("../fns/isTokenValid.js");

class Session {
  async create(jwt, refreshTokenId, userId, transaction) {
    const values = { jwt, refreshTokenId, userId };
    const undefinedKey = Object.keys(values).find((key) => !values[key]);

    if (undefinedKey) {
      throw error(`${undefinedKey} not defined`);
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
    const session = await modelSession.findOne({
      where: { jwt },
      include: modelToken,
      transaction,
    });

    return session;
  }

  async deleteSession(jwt, transaction) {
    const session = await this.findSession(jwt, transaction);
    return session.destroy(transaction);
  }

  async setToken(jwt, token, transaction) {
    const session = await this.findSession(jwt, transaction);
    const refreshToken = session.refreshToken.token;
    const isTokenValid = await bcrypt.compare(token, refreshToken);

    if (!isTokenValid) {
      throw error("invalid jwt or refresh token");
    }

    const newToken = await serviceToken.createToken(transaction);
    session.token = newToken[0].id;
    await session.save({ transaction });
    return newToken[1];
  }

  async setJwt(jwt, token, user, transaction) {
    const session = await this.findSession(jwt, transaction);
    const refreshToken = session.refreshToken.token;
    const isTokenValid = await bcrypt.compare(token, refreshToken);

    if (!isTokenValid) {
      throw error("invalid jwt or refresh token");
    }

    const newJwt = generateJwt(user);

    session.jwt = newJwt;
    await session.save({ transaction });
    return newJwt;
  }

  async changeValidateSession(jwt,validate, transaction) {
    const session = await modelSession.findOne({ where: { jwt }, transaction });
    if(!session) {
      throw error("session invalid");
      throw error('')
    }
    session.isValid = validate;
    return session.save({ transaction });
  }

  async validateSession(jwt, currentDate, transaction) {
    const session = await this.findSession(jwt, transaction);
    if (!session) {
      throw error("session invalid");
    }

    const validadteToken = isTokenValid(session.refreshToken.createdAt, currentDate);

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

module.exports = new Session();