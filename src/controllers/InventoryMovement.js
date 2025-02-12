class ApiMovement {

    async findAll(req, res) {
        try {
            const movement = {} // await service.findAll()
            res.status(200).json(movement)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const {id} = req.params
            const movement = {} // await service.findOne(id)
            res.status(200).json(movement)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const {userId, inventoryId, ProductId, amount, typeMoviment} = req.body
            const movement = {} //await service.create(userId, inventoryId, ProductId, amount, typeMoviment)
            res.status(201).json({created: movement})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id} = req.params
            const {field, value} = req.body
            //await service.update(id ,field, value)
            const movement = {} //await this.findOne(id)
            res.status(201).json({movement})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id} = req.params
            const movement = {} //await service.delete(id)
            res.status(201).json({movement})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiMovement()