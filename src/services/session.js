const error = require("../fns/error.js");
const repository = require("../repository/repository.js");
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
    return sessions;
  }

  async findSession(jwt, transaction) {
    const session = await this.repository.findOne({ jwt }, transaction);
    if (!session) {
      throw this.error("session invalid");
    }
    return session
  }

  async getRefreshToken(session, transaction) {
    if (!session) {
      throw this.error("invalid session");
    }
    const jwt = session.jwt;
    const sessionAllFields = await this.repository.findOneWithSensibleFields(
      { jwt },
      transaction
    );
    const refreshToken = sessionAllFields.refreshToken;
    return refreshToken;
  }

  async deleteSession(session, transaction) {
    return this.repository.delete(session, transaction);
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
       session,
        field,
        value,
        transaction
      );
    } else if (field === "isValid" && typeof value === "boolean") {
      updatedSession = await this.repository.update(
       session,
        field,
        value,
        transaction
      );
    } else {
      throw this.error("invalid field to modification");
    }

    return updatedSession
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
  new repository(require("../models/session.js")
  ),
  crypto,
  error
);
