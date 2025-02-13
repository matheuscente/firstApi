class ApiInventory {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const inventories = [{}]// await service.findAll(organizationId)
            res.status(200).json(inventories)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
    async findOne(req, res) {
        try {
            const organizationId = 1
            const {id} = req.params
            const inventory = {} // await service.findOne(id)
            res.status(200).json(inventory)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async create(req, res) {
        try {
            const organizationId = 1
            const {name} = req.body
            const inventory = {} //await service.create(name, organizationId)
            res.status(201).json({created: inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const organizationId = 1
            const {id} = req.params
            const {name} = req.body
            const inventory = {id, name} //await service.update(id, name)
            res.status(201).json({inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const organizationId = 1
            const {id} = req.params
            const inventory = {} //await service.delete(id)
            res.status(201).json({inventory})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiInventory()