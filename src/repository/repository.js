

class Repository {
    constructor(model, models) {
        this.model = model
        this.alternativeModels = models
    }

    async findAll(data, transaction) {
        if(this.alternativeModels) {
                const models = this.alternativeModels.map((model) => {
                    return {model: model}
                })
                return this.model.findOne({where: {...data}, include: [...models], transaction})
            
        }
        return this.model.findAll({where: {...data}, transaction})
    }

    async findOne(data, id, transaction) {
        if(data) {
            return this.model.findOne({where: {...data, id}, transaction})
        }
        return this.model.findOne({where: {id}, transaction})
    }

    async create(data, transaction) {
        return this.model.create(data, {transaction})
    }

    async update(entity, field, value, transaction) {
        entity[field] = value
        return entity.save({transaction})
    }

    async delete(entity, transaction) {
        return entity.destroy({transaction})
    }
}

module.exports = Repository