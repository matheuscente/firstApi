class ApiProduct {

    async findAll(req, res) {
        try {
            const product = {} // await service.findAll()
            res.status(200).json(product)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const {id} = req.params
            const product = {} // await service.findOne(id)
            res.status(200).json(product)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const {name, description, organizationId} = req.body
            const product = {} //await service.create(name, description, organizationId)
            res.status(201).json({created: product})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id} = req.params
            const {field, value} = req.body
            //await service.update(id ,field, value)
            const product = {} //await this.findOne(id)
            res.status(201).json({product})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id} = req.params
            const product = {} //await service.delete(id)
            res.status(201).json({product})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiProduct()