const error = require("../fns/error.js");
const repository = require("../repository/repositoryUser.js");
const crypto = require("../services/crypto.js");

const salt = 10;

class Session {
  constructor(repository, crypto, error) {
    this.repository = repository;
    this.security = crypto;
    this.error = error;
  }
  async create(jwt, userId, transaction) {
    if (!jwt) {
      throw this.error("invalid jwt");
    } else if (!userId) {
      throw this.error("invalid user");
    }

    const isJwtValid = this.security.verifyJwt(jwt);
    if (!isJwtValid.isValid) {
      throw this.error("token invalid or not provided");
    }
    const refreshToken = this.security.randomicPass();
    const hashedToken = await this.security.hash(refreshToken, salt);

    const session = await this.repository.create(
      { jwt, refreshToken: hashedToken, userId, isValid: true },
      transaction
    );
    return { refreshToken, createdAt: session.createdAt };
  }

  async findAllUserSessions(userId, transaction) {
    const sessions = await this.repository.findAll({ userId }, transaction);
    const returnSessions = sessions.map((session) => {
      const returnSessionsMap = { ...session };
      delete returnSessionsMap.userId;
      delete returnSessionsMap.user.dataValues.password;
      delete returnSessionsMap.refreshToken;
      return returnSessionsMap;
    });

    return returnSessions;
  }

  async findSession(jwt, transaction) {
    const session = await this.repository.findOne({ jwt }, transaction);
    if (!session) {
      throw this.error("session invalid");
    }
    const returnSession = { ...session.dataValues };
    delete returnSession.userId;
    delete returnSession.user.dataValues.password;
    delete returnSession.refreshToken;
    return returnSession;
  }

  async getRefreshToken(session, transaction) {
    if (!session) {
      throw this.error("invalid session");
    }
    const jwt = session.jwt;
    const sessionAllFields = await this.repository.findOne(
      { jwt },
      transaction
    );
    const refreshToken = sessionAllFields.refreshToken;
    return refreshToken;
  }

  async deleteSession(session, transaction) {
    const deletedSession = this.repository.delete(session, transaction);
    const returnSession = { ...deletedSession };
    delete returnSession.user.password;
    return returnSession;
  }

  async update(session, field, value, transaction) {
    if (!session) {
      throw this.error("invalid session");
    }
    let updatedSession;

    if (field === "jwt") {
      if (!value) {
        throw this.error("invalid value to modification");
      }
      updatedSession = await this.repository.update(
        await this.repository.findOne({ id: session.id }, transaction),
        field,
        value,
        transaction
      );
    } else if (field === "isValid" && typeof value === "boolean") {
      updatedSession = await this.repository.update(
        await this.repository.findOne({ id: session.id }, transaction),
        field,
        value,
        transaction
      );
    } else {
      throw this.error("invalid field to modification");
    }

    const returnUpdatedSession = { ...updatedSession.dataValues};
    delete returnUpdatedSession.user.dataValues.password;
    delete returnUpdatedSession.refreshToken
    return returnUpdatedSession;
  }

  async isSessionValid(session, transaction) {
    if (!session.isValid) {
      return false;
    }
    let dateCreate = session.createdAt;
    const day = 86400000;
    let validate = day * 7;
    dateCreate = dateCreate.getTime();
    validate = dateCreate + validate;

    const isValid = validate > Date.now();

    if (!isValid) {
      await this.update(session, "isValid", false, transaction);
      return false;
    }
    return true;
  }
}

module.exports = new Session(
  new repository(require("../models/session.js"), 
    require("../models/User.js"),
  ),
  crypto,
  error
);
