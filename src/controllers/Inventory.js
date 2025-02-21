const service = require('../services/Inventory.js')

class ApiInventory {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const inventories = await service.findAll(organizationId)
            res.status(200).json(inventories)
        } catch(error) {
            if(error.code === 1 ) {
                res.status(400).json({error: error.message})
            } else {
                console.log(error)
                res.status(400).json({error: "unknown error"})
            }
            
        }
    }
    async findOne(req, res) {
        try {
            const organizationId = 1
            const id = req.params.id
            const inventory = await service.findOne(organizationId, id)
            res.status(200).json(inventory)
        } catch(error) {
            if(error.code === 1 ) {
                res.status(400).json({error: error.message})
            } else {
                console.log(error)
                res.status(400).json({error: "unknown error"})
            }
        }
    }

    async create(req, res) {
        try {
            const organizationId = 1
            const {name} = req.body
            const inventory = await service.create(organizationId,name)
            res.status(201).json({created: inventory})
        } catch(error) {
            if(error.code === 1 ) {
                res.status(400).json({error: error.message})
            } else {
                console.log(error)
                res.status(400).json({error: "unknown error"})
            }
        }

    }

    async update(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const {name} = req.body
            const inventory = await service.update(organizationId, id, name)
            res.status(201).json({inventory})
        } catch(error) {
            if(error.code === 1 ) {
                res.status(400).json({error: error.message})
            } else {
                console.log(error)
                res.status(400).json({error: "unknown error"})
            }
        }
    }


    async delete(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const inventory = await service.delete(organizationId, id)
            res.status(201).json({inventory})
        } catch(error) {
            if(error.code === 1 ) {
                res.status(400).json({error: error.message})
            } else {
                console.log(error)
                res.status(400).json({error: "unknown error"})
            }
    }
}
}

module.exports = new ApiInventory()