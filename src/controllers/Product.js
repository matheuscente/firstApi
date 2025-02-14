class ApiProduct {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const products = [{}] // await service.findAll(organizationId)
            res.status(200).json(products)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const organizationId = 1
            const id = req.params.id
            const product = {} // await service.findOne(organizationId, id)
            res.status(200).json(product)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const organizationId = 1
            const {name, description} = req.body
            const product = {name, description, organizationId} //await service.create(name, description, organizationId)
            res.status(201).json({created: product})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const {field, value} = req.body
            //await service.update(organizationId, id ,field, value)
            const product = {} //await this.findOne(id)
            res.status(201).json({product})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const product = {} //await service.delete(organizationId, id)
            res.status(201).json({product})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiProduct()