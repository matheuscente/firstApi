const service = require('../services/Product.js')

class ApiProduct {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const products =  await service.findAll(organizationId)
            res.status(200).json(products)
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
            const product = await service.findOne(organizationId, id)
            res.status(200).json(product)
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
            const {name, description} = req.body
            const product = await service.create(organizationId, name, description)
            res.status(201).json({created: product})
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
            const {field, value} = req.body
            
            const product = await service.update(organizationId, id ,field, value)
            res.status(201).json({product})
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
            const product = await service.delete(organizationId, id)
            res.status(201).json({product})
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

module.exports = new ApiProduct()