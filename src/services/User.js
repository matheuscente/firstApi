const modelOrganization = require("../models/Organization.js");
const error = require("../fns/error.js");
const modelUser = require("../models/User.js");
const bcrypt = require("bcrypt");
require("dotenv").config("./config.env");
const verifyOrganization = require("../fns/verifyOrganization.js");
const jwt = require("jsonwebtoken");
require("dotenv").config("../config.env");
const serviceToken = require("./token.js");


const salt = 10;
const key = process.env.JWT_KEY;
class ServiceUser {
  async findAll(organizationId) {
    await verifyOrganization(organizationId);
    const users = await modelUser.findAll({
      where: { organizationId },
      include: modelOrganization,
    });

    if (users.length === 0) {
      throw error("no have users in this organization");
    }

    const returnUsers = JSON.parse(JSON.stringify(users));
    for (const user in returnUsers) {
      delete returnUsers[user].password;
    }
    return returnUsers;
  }

  async findOne(organizationId, id) {
    await modelOrganization.findOne({ where: { id: organizationId } });

    if (!id || isNaN(id)) {
      throw error("invalid userId");
    }
    const user = await modelUser.findOne({
      where: { organizationId, id },
      include: modelOrganization,
    });

    if (!user) {
      throw error("no user with this id in this organization");
    }

    const returnUser = JSON.parse(JSON.stringify(user));
    delete returnUser.password;
    return returnUser;
  }

  async create(organizationId, name, email, password, role) {
    const organization = await modelOrganization.findOne({
      where: { id: organizationId },
    });

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
    });

    return this.findOne(user.organizationId, user.id);
  }

  async update(organizationId, id, field, value) {
    await verifyOrganization(organizationId);

    const user = await modelUser.findOne({ where: { organizationId, id } });

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

        return this.findOne(organizationId, id);

      case "email":
        user.email = value;
        await user.save();

        return this.findOne(organizationId, id);

      case "role":
        if (user.role === "employee" && value === "admin") {
          throw error("change not allowed");
        }
        if (!(value === "admin" || value === "employee")) {
          throw error("invalid role");
        }
        user.role = value;
        await user.save();

        const token = jwt.sign(
          {
            id: user.id,
            organizationId: user.organizationId,
            role: user.role,
          },
          key,
          { expiresIn: 60 * 60 }
        );

        return {
          user: await this.findOne(organizationId, id),
          newToken: token,
        };

      case "password":
        const hashedPass = await bcrypt.hash(value, salt);
        user.password = hashedPass;
        await user.save();

        return this.findOne(organizationId, id);

      case "organizationId":
        throw error("change not allowed");

      case "id":
        throw error("change not allowed");

      default:
        throw error("invalid field for modify or not provided");
    }
  }

  async delete(organizationId, id) {
    await verifyOrganization(organizationId);

    const user = await modelUser.findOne({
      where: { organizationId, id },
      include: modelOrganization,
    });

    if (!user) {
      throw error("this user don't exists");
    }

    const returnUser = JSON.parse(JSON.stringify(user));
    delete returnUser.password;
    await user.destroy({ include: modelOrganization });
    return returnUser;
  }

  async login(email, password) {
    if (!email || !password) {
      throw error("email or password not provided");
    }
    const user = await modelUser.findOne({ where: { email } });

    if (!user) {
      throw error("invalid email or password");
    }

    const credentialsOk = await bcrypt.compare(password, user.password);

    if (!credentialsOk) {
      throw error("invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        organizationId: user.organizationId,
        role: user.role,
      },
      key,
      { expiresIn: 60 * 60 }
    )

   const refreshToken = await serviceToken.add(user.id, token);

    return refreshToken
  }

  async verify(id, role) {
    console.log(role);
    return await modelUser.findOne({ where: { id, role } });
  }
}

module.exports = new ServiceUser();
