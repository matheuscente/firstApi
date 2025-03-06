const service = require("../services/InventoryMovement.js");

class ApiMovement {
  async findAll(req, res) {
    try {
      const organizationId = 1;
      const inventoryId = req.params.inventoryId;
      const movements = await service.findAll(organizationId, inventoryId);
      res.status(200).json(movements);
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
      const organizationId = 1;
      const { id, inventoryId } = req.params;
      const movement = await service.findOne(id, organizationId, inventoryId);
      res.status(200).json(movement);
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
      const organizationId = 1;
      const inventoryId = req.params.inventoryId;
      const { userId, amount, typeMoviment, productId } = req.body;
      const movement = await service.create(
        organizationId,
        userId,
        inventoryId,
        productId,
        amount,
        typeMoviment
      );
      res.status(201).json({ created: movement });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(400).json({ error: "unknown error" });
      }
    }
  }

  async update(req, res) {
    try {
      const organizationId = 1;
      const { id, inventoryId } = req.params;
      const { field, value } = req.body;
      const movement = await service.update(
        organizationId,
        id,
        inventoryId,
        field,
        value
      );
      res.status(201).json({ movement });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(400).json({ error: "unknown error" });
      }
    }
  }

  async delete(req, res) {
    try {
      const organizationId = 1;
      const { id, inventoryId } = req.params;
      const movement = await service.delete(organizationId, inventoryId, id);
      res.status(201).json({ movement });
    } catch (error) {
      if (error.code === 1) {
        res.status(400).json({ error: error.message });
      } else {
        console.log(error);
        res.status(400).json({ error: "unknown error" });
      }
    }
  }
}

module.exports = new ApiMovement();
