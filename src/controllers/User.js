class ApiUser {

    async findAll(req, res) {
        try {
            const user = {} // await service.findAll()
            res.status(200).json(user)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const {id} = req.params
            const user = {} // await service.findOne(id)
            res.status(200).json(user)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const {name, email, senha, organizationId} = req.body
            const user = {} //await service.create(name, email, senha, organizationId)
            res.status(201).json({created: user})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const {id} = req.params
            const {field, value} = req.body
            //await service.update(id ,field, value)
            const user = {} //await this.findOne(id)
            res.status(201).json({user})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const {id} = req.params
            const user = {} //await service.delete(id)
            res.status(201).json({user})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiUser()