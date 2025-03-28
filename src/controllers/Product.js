const service = require("../factories/services/product.js");

class ApiProduct {
  async findAll(req, res) {
    try {
      const organizationId = req.session.organizationId
      const products = await service.findAll(organizationId, transaction);
      res.status(200).json(products);
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "unknown error" });
      }
    }
  }

  async findOne(req, res) {
    try {
      const organizationId = req.session.organizationId
      const id = req.params.id;
      const product = await service.findOne(organizationId, id, transaction);
      res.status(200).json(product);
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "unknown error" });
      }
    }
  }

  async create(req, res) {
    try {
      const organizationId = req.session.organizationId
      const { name, description } = req.body;
      const product = await service.create(organizationId, name, description, transaction);
      res.status(201).json({ created: product });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "unknown error" });
      }
    }
  }

  async update(req, res) {
    try {
      const organizationId = req.session.organizationId
      const id = req.params.id;
      const { field, value } = req.body;
      const getProduct = await service.findOne(organizationId, id, transaction)
      const product = await service.update(getProduct, field, value, transaction);
      res.status(201).json({ product });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "unknown error" });
      }
    }
  }

  async delete(req, res) {
    try {
      const organizationId = req.session.organizationId
      const id = req.params.id;
      const getProduct = await service.findOne(organizationId, id, transaction)
      const product = await service.delete(getProduct, transaction);
      res.status(201).json({ product });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "unknown error" });
      }
    }
  }
}

module.exports = new ApiProduct();
