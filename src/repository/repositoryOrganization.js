class Repository {
    constructor(model) {
        this.model = model
    }

    async findAll(whereParams, transaction) {
        return this.model.findAll({where: whereParams, transaction})
    }

    async findOne(whereParams, transaction) {
        return this.model.findOne({where: whereParams, transaction})
    }

    async create(data, transaction) {
        return this.model.create(data, {transaction})
    }

    async update(entity, field, value, transaction) {
        entity[field] = value
        return entity.save({transaction})
    }

    async delete(entity, transaction) {
        console.log(entity)
        return entity.destroy({transaction})
    }
}

module.exports = Repository