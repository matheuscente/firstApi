class ApiUser {

    async findAll(req, res) {
        try {
            const organizationId = 1
            const users = [{}] // await service.findAll()
            res.status(200).json(users)
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async findOne(req, res) {
        try {
            const organizationId = 1
            const id = req.params.id
            const user = {id} // await service.findOne(id)
            res.status(200).json(user)
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async create(req, res) {
        try {
            const organizationId = 1
            const {name, email, password, role} = req.body
            const user = {name, email, password, role} //await service.create(name, email, password, role, organizationId)
            res.status(201).json({created: user})
        } catch(error) {
            res.status(400).json({error: error})
        }

    }

    async update(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const {field, value} = req.body
            const user = {} //await service.update(id ,field, value)
            res.status(201).json({user})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }

    async delete(req, res) {
        try{
            const organizationId = 1
            const id = req.params.id
            const user = {} //await service.delete(id)
            res.status(201).json({user})
        } catch(error) {
            res.status(400).json({error: error})
        }
    }
}

module.exports = new ApiUser()