class ApiOrganization {
    async findOne(req, res) {
        try {
            const {id} = req.params
            const organization = {} // await service.findOne(id)
            res.status(200).json(organization)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const {name, address, phone, email} = req.body
            const organization = {} //await service.create(name, address, phone, email)
            res.status(201).json({created: organization})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id} = req.params
            const {field, value} = req.body
            //await service.update(id ,field, value)
            const organization = {} //await this.findOne(id)
            res.status(201).json({organization})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id} = req.params
            const organization = {} //await service.delete(id)
            res.status(201).json({organization})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiOrganization()