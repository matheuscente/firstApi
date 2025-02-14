class ApiMovement {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const inventoryId = req.params.id
            const movements = [{}] // await service.findAll(organizationId, inventoryId)
            res.status(200).json(movements)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const organizationId = 1
            const {id, inventoryId} = req.params
            const movement = {} // await service.findOne(id, organizationId, inventoryId)
            res.status(200).json(movement)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const userId = 1
            const inventoryId = req.params.id
            const {amount, typeMoviment, productId} = req.body
            const movement = {} //await service.create(userId, inventoryId, ProductId, amount, typeMoviment)
            res.status(201).json({created: movement})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id, inventoryId} = req.params
            const {field, value} = req.body
            const movement = {} //await service.update(id ,inventoryId, field, value)
            res.status(201).json({movement})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id, inventoryId} = req.params
            const movement = {} //await service.delete(id, inventoryId)
            res.status(201).json({movement})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiMovement()