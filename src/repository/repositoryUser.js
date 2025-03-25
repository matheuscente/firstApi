class RepositoryUser {
    constructor(model, alternativeModels) {
        this.model = model
        this.alternativeModels = alternativeModels
    }



    async findAll(whereParams, transaction) {
        return this.model.findAll({where: whereParams, include: {model: this.alternativeModels}, transaction})
    }

    async findOne(whereParams, transaction) {
        return this.model.findOne({where: whereParams, include: {model: this.alternativeModels}, transaction})  
    }

    async findOneWithOutSensibleFields(whereParams, transaction) {
         return this.model.findOne({where: whereParams, attributes: {exclude: ['password', 'organizationId']}, include: {model: this.alternativeModels}, transaction})
        
        }

    async findAllWithOutSensibleFields(whereParams, transaction) {
            return this.model.findAll({where: whereParams, attributes: {exclude: ['password', 'organizationId']}, include: {model: this.alternativeModels}, transaction})
           
           }

    async create(data, transaction) {
        return this.model.create(data, {attributes: {exclude: ['password', 'organizationId']}, include: {model: this.alternativeModels}, transaction})
    }

    async update(entity, field, value, transaction) {
        entity[field] = value
        return entity.save({attributes: {exclude: ['password', 'organizationId']}, include: {model: this.alternativeModels}, transaction})
    }

    async delete(entity, transaction) {
        return entity.destroy({attributes: {exclude: ['password', 'organizationId']}, include: {model: this.alternativeModels}, transaction})
    }
}

module.exports = RepositoryUser