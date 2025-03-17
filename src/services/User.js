const modelOrganization = require("../models/Organization.js");
const error = require("../fns/error.js");
const modelUser = require("../models/User.js");
const bcrypt = require("bcrypt");
const verifyOrganization = require("../fns/verifyOrganization.js");
const serviceToken = require("./refreshToken.js");
const serviceSession = require('./session.js')
const generateJwt = require('../fns/generateJwt.js')

const salt = 10;
class ServiceUser {
  async findAll(organizationId, transaction) {
    await verifyOrganization(organizationId, transaction);
    const users = await modelUser.findAll({
      where: { organizationId },
      include: modelOrganization, transaction });

    if (users.length === 0) {
      throw error("no have users in this organization");
    }

    const returnUsers = JSON.parse(JSON.stringify(users));
    for (const user in returnUsers) {
      delete returnUsers[user].password;
    }
    return returnUsers;
  }

  async findOne(organizationId, id, transaction) {
    await modelOrganization.findOne({ where: { id: organizationId } ,  transaction });

    if (!id || isNaN(id)) {
      throw error("invalid userId");
    }
    const user = await modelUser.findOne({
      where: { organizationId, id },
      include: modelOrganization,  transaction });

    if (!user) {
      throw error("no user with this id in this organization");
    }

    const returnUser = JSON.parse(JSON.stringify(user));
    delete returnUser.password;
    return returnUser;
  }

  async create(organizationId, name, email, password, role, transaction) {
    const organization = await modelOrganization.findOne({
      where: { id: organizationId }
  ,  transaction });

    if (!organization) {
      throw error("organization not found");
    }

    const objVerify = {
      organizationId: organizationId,
      name: name,
      email: email,
      password: password,
      role: role,
    };

    for (const item in objVerify) {
      if (!objVerify[item]) {
        throw error(`please give a ${item}`);
      }
    }

    const hashedPass = await bcrypt.hash(password, salt);

    if (!(role === "admin" || role === "employee")) {
      throw error("invalid role");
    }
    const user = await modelUser.create({
      organizationId,
      name,
      email,
      password: hashedPass,
      role,
    }, { transaction });

    return this.findOne(user.organizationId, user.id, transaction);
  }

  async update(organizationId, id, field, value, transaction) {
    await verifyOrganization(organizationId, transaction);

    const user = await modelUser.findOne({ where: { organizationId, id } , transaction });

    if (!user) {
      throw error("this user don't exists");
    }

    if (!value) {
      throw error("please set a value to modify");
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
          throw error("change not allowed");
        }
        if (!(value === "admin" || value === "employee")) {
          throw error("invalid role");
        }
        user.role = value;
        await user.save();

        const token = generateJwt(user)

        return {
          user: await this.findOne(organizationId, id, transaction),
          newToken: token,
        };

      case "password":
        const hashedPass = await bcrypt.hash(value, salt);
        user.password = hashedPass;
        await user.save({ transaction });

        return this.findOne(organizationId, id, transaction);

      case "organizationId":
        throw error("change not allowed");

      case "id":
        throw error("change not allowed");

      default:
        throw error("invalid field for modify or not provided");
    }
  }

  async delete(organizationId, id, transaction) {
    await verifyOrganization(organizationId, transaction);

    const user = await modelUser.findOne({
      where: { organizationId, id },
      include: modelOrganization
  ,  transaction });

    if (!user) {
      throw error("this user don't exists");
    }

    const returnUser = JSON.parse(JSON.stringify(user));
    delete returnUser.password;
    await user.destroy({ include: modelOrganization ,  transaction });
    return returnUser;
  }

  async login(email, password, transaction) {
    if (!email || !password) {
      throw error("email or password not provided");
    }
    const user = await modelUser.findOne({ where: { email } ,  transaction });

    if (!user) {

      throw error("invalid email or password");

    }

    const credentialsOk = await bcrypt.compare(password, user.password);

    if (!credentialsOk) {
      throw error("invalid email or password");
    }

    const token = generateJwt(user)

    const refreshToken = await serviceToken.createToken(transaction);

    await serviceSession.create(token, refreshToken[0].id, user.id, transaction)

    return { token, refreshToken: refreshToken[1] }
  }

  async logout(jwt, transaction) {
    return serviceSession.changeValidateSession(jwt, transaction)
  }

  async getNewJwt(jwtToken, token, currentSession, transaction) {
    const user = await this.findOne(currentSession.organizationId, currentSession.id, transaction)
    if (!user) {
      throw error('user not found')
    }
    return await serviceSession.setJwt(jwtToken, token, user, transaction)

  }



  async verify(id, role, transaction) {
    return await modelUser.findOne({ where: { id, role } ,  transaction });
  }
}

module.exports = new ServiceUser();
