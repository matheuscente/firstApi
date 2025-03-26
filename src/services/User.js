const error = require("../fns/error.js");
const verifyOrganization = require("../fns/verifyOrganization.js");
const serviceSession = require("./session.js");
const repository = require("../repository/repository.js");
const crypto = require("./crypto.js");

const salt = 10;
class ServiceUser {
  constructor(repository, error, verifyOrganization, serviceSession, crypto) {
    this.repository = repository;
    this.security = crypto;
    this.error = error;
    this.verifyOrganization = verifyOrganization;
    this.serviceSession = serviceSession;
  }
  async findAll(organizationId, transaction) {
    await verifyOrganization(organizationId, transaction);

    const users = await this.repository.findAll(
      { organizationId },
      transaction
    );

    if (users.length === 0) {
      throw this.error("no have users in this organization");
    }

    return users
  }

  async findOne(organizationId, id, transaction) {
    if (!id || isNaN(id)) {
      throw this.error("invalid userId");
    }
    await this.verifyOrganization(organizationId, transaction);
    const user = await this.repository.findOne(
      { organizationId, id },
      transaction
    );

    if (!user) {
      throw this.error("no user with this id in this organization");
    }
    
    return user
  }

  async create(data, transaction) {
    const { organization, name, email, password, role } = data;
    if (!organization.id) {
      throw this.error("organization not found");
    }
    const objVerify = {
      organizationId: organization.id,
      name: name,
      email: email,
      password: password,
      role: role,
    };

    for (const item in objVerify) {
      if (!objVerify[item]) {
        throw this.error(`please give a ${item}`);
      }
    }

    const hashedPass = await this.security.hash(password, salt);

    if (!(role === "admin" || role === "employee")) {
      throw this.error("invalid role");
    }

    const user = await this.repository.create(
      {
        organizationId: organization.id,
        name,
        email,
        password: hashedPass,
        role,
      },
      transaction
    );

    
    return this.findOne(organization.id, user.id, transaction)
  }

  async update(organizationId, id, field, value, transaction) {
    await verifyOrganization(organizationId, transaction);

    const user = await modelUser.findOne({
      where: { organizationId, id },
      transaction,
    });

    if (!user) {
      throw this.error("this user don't exists");
    }

    if (!value) {
      throw this.error("please set a value to modify");
    }

    switch (field) {
      case "name":
        user.name = value;
        await user.save();

        return this.findOne(organizationId, id, transaction);

      case "email":
        user.email = value;
        await user.save();

        return this.findOne(organizationId, id, transaction);

      case "role":
        if (user.role === "employee" && value === "admin") {
          throw this.error("change not allowed");
        }
        if (!(value === "admin" || value === "employee")) {
          throw this.error("invalid role");
        }
        user.role = value;
        await user.save();

        const token = generateJwt(
          {
            id: user.id,
            organizationId: user.organizationId,
            role: user.role,
          },
          60 * 60
        );

        return {
          user: await this.findOne(organizationId, id, transaction),
          newToken: token,
        };

      case "password":
        const hashedPass = await this.security.hash(value, salt);
        user.password = hashedPass;
        await user.save({ transaction });

        return this.findOne(organizationId, id, transaction);

      case "organizationId":
        throw this.error("change not allowed");

      case "id":
        throw this.error("change not allowed");

      default:
        throw this.error("invalid field for modify or not provided");
    }
  }

  async delete(user, transaction) {
    return await this.repository.delete(user, transaction);
  }

  async login(email, password, transaction) {
    if (!email || !password) {
      throw this.error("email or password not provided");
    }
    const user = await this.repository.findOneWithSensibleFields({ email }, transaction);
    
    if (!user) {
      throw this.error("invalid email or password");
    }

    const credentialsOk = await this.security.compare(password, user.password);

    if (!credentialsOk) {
      throw this.error("invalid email or password");
    }

    const token = this.security.generateJwt(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      60 * 60
    );

    let session 

    try{session = await serviceSession.create(token, user.id, transaction);} catch(err) {
      console.log(err)
    }
    return {
      token,
      refreshToken: session.refreshToken,
      createdAt: session.createdAt,
    };
  }

  async logout(jwt, refreshToken, transaction) {
    const session = await this.serviceSession.findSession(jwt, transaction);

    if (!session) {
      throw this.error("session invalid");
    }
    const sessionRefreshToken = await this.serviceSession.getRefreshToken(
      session,
      transaction
    );
    if (!refreshToken) {
      throw this.error("refresh token invalid or not provided");
    }
    const isRTvalid = await this.security.compare(
      refreshToken,
      sessionRefreshToken
    );

    if (!isRTvalid) {
      throw this.error("permission denied");
    }

    return this.serviceSession.update(session, "isValid", false, transaction);
  }

  async getNewJwt(session, refreshToken, transaction) {
    if (!session) {
      throw this.error("session not found");
    }

    const user = session.user;
    
    if(!user) {
      throw this.error('invalid user')
    }

    const sessionRefreshToken = await this.serviceSession.getRefreshToken(
      session,
      transaction
    );
    const isRefreshTokenCorrect = await this.security.compare(
      refreshToken,
      sessionRefreshToken
    );
    if (!isRefreshTokenCorrect) {
      throw this.error("invalid refreshToken");
    }
    const isSessionValid = await this.serviceSession.isSessionValid(
      session,
      transaction
    );

    if (!isSessionValid) {
      throw this.error("invalid Session");
    }

    const token = this.security.generateJwt(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      60 * 60
    );
    const updated = await this.serviceSession.update(
      session,
      "jwt",
      token,
      transaction
    );
    return updated.jwt;
  }

  async verify(id, role, transaction) {
    if(!id) {
      throw this.error("invalid id")
    } else if(!role) {
      throw this.error('invalid role')
    }
    return await this.repository.findOne({ id, role }, transaction);
  }
}

module.exports = new ServiceUser(
  new repository(require("../models/User.js")
  ),
  error,
  verifyOrganization,
  serviceSession,
  crypto
);
