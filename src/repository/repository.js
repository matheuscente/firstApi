

class Repository {
    constructor(model, models) {
        this.model = model
        this.alternativeModels = models
    }

    async findAll(whereParams, transaction) {
        if(this.alternativeModels) {
                const models = this.alternativeModels.map((model) => {
                    return {model: model}
                })
                return this.model.findAll({where: whereParams, include: [...models], transaction})
            
        }
        return this.model.findAll({where: whereParams, transaction})
    }

    async findOne(whereParams, transaction) {
        console.log(whereParams)
        if(this.alternativeModels) {
            const models = this.alternativeModels.map((model) => {
                return {model: model}
            })
            return this.model.findOne({where: whereParams, include: [...models], transaction})
        
    }
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
        return entity.destroy({transaction})
    }
}

module.exports = Repository