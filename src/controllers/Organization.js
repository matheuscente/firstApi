const service = require("../services/Organization.js");

class ApiOrganization {
  async findOne(req, res) {
    try {
      const id = req.params.id;
      const organization = await service.findOne(id);
      res.status(200).json(organization);
    } catch (err) {
      console.log(err.name);
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err);
        res.status(400).json({ error: `unknown error` });
      }
    }
  }

  async create(req, res) {
    try {
      const { name, address, phone, email } = req.body;
      const organization = await service.create(name, address, phone, email);
      res.status(201).json({ created: organization });
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
      const id = req.params.id;
      const { field, value } = req.body;
      const organization = await service.update(id, field, value);
      res.status(201).json({ organization });
    } catch (err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ error: `Please send another ${err.errors[0].path}` });
      } else {
        res.status(400).json({ error: "unknown error" });
      }
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const organization = await service.delete(id);
      res.status(200).json({ organization });
    } catch (err) {
      if (err.code === 1) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "unknown error" });
      }
    }
  }
}

module.exports = new ApiOrganization();
