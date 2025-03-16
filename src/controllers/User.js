const service = require("../services/User.js");
const serviceSession = require('../services/session.js')

class ApiUser {
  async findAll(req, res) {
    try {
      const organizationId = req.session.organizationId
      const users = await service.findAll(organizationId);
      res.status(200).json(users);
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(400).json({ error: "unknown error" });
      }
    }
  }

  async findOne(req, res) {
    try {
      let id = req.params.id 

      const {organizationId} = req.session;
      if(req.route.path === "/info") {
        id = req.session.id
      }
      const user = await service.findOne(organizationId, id);
      res.status(200).json(user);
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(400).json({ error: "unknown error" });
      }
    }
  }

  async create(req, res) {
    try {
      const organizationId = req.session.organizationId
      const { name, email, password, role } = req.body;
      const user = await service.create(
        organizationId,
        name,
        email,
        password,
        role
      );
      res.status(201).json({ created: user });
    } catch (err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ error: `Please send another ${err.errors[0].path}` });
      } else {
        console.log(err);
        res.status(400).json({ error: `unknown error` });
      }
    }
  }

  async update(req, res) {
    try {
      let id = req.params.id 

      const {organizationId} = req.session;
      if(req.route.path === "/update") {
        id = req.session.id
      }
      const { field, value } = req.body;
      const user = await service.update(organizationId, id, field, value);
      res.status(201).json({ user });
    } catch (err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ error: `Please send another ${err.errors[0].path}` });
      } else {
        console.log(err);
        res.status(400).json({ error: `unknown error` });
      }
    }
  }

  async delete(req, res) {
    try {
      const organizationId = req.session.organizationId
      const id = req.params.id;
      const user = await service.delete(organizationId, id);
      res.status(201).json({ user });
    } catch (err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err);
        res.status(400).json({ error: `unknown error` });
      }
    }
  }

  async login(req, res) {
    try {
      const {email, password} = req.body

      const token = await service.login(email, password)

      res.status(200).json({token: token})
    } catch(err) {
        if (err.code === 1) {
          res.status(400).json({ error: err.message });
        } else {
          console.log(err);
          res.status(400).json({ error: `unknown error` });
        }
      }
  }

  async logout(req, res) {
    try {
      const jwt = req.headers['authorization']
      console.log(jwt)
      const session = await service.logout(jwt)
      res.status(200).json({session})
    } catch(err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err);
        res.status(400).json({ error: `unknown error` });
      }
    }
  }

  async getNewJwt(req, res) {
    console.log(req.session)
   try {
    const session = req.session
    
    const jwt = req.headers['authorization']
    const {token} = req.body
    const newJwt = await service.getNewJwt(jwt, token, session)
    res.status(200).json({newJwt})
   } catch(err) {
    if (err.code === 1) {
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(400).json({ error: `unknown error` });
    }
  }
  }

}

module.exports = new ApiUser();
