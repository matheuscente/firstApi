class ApiInventory {
    async findOne(req, res) {
        try {
            const {id} = req.params
            const inventory = {} // await service.findOne(id)
            res.status(200).json(inventory)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const {name, items, organizationId} = req.body
            const inventory = {} //await service.create({name, items, organizationId)
            res.status(201).json({created: inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id} = req.params
            const {field, value} = req.body
            await service.update(id ,field, value)
            const inventory = await this.findOne(id)
            res.status(201).json({inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id} = req.params
            const inventory = await service.delete(id)
            res.status(201).json({inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiInventory()