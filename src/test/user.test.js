const service = require('../services/User.js')
const serviceOrganization = require('../services/Organization.js')
const database = require('../DataBase.js');
const Repository = require('../repository/repository.js');

describe("user test", () => {
    let transaction;
    let token
    let organization

    beforeEach(async () => {
        transaction = await database.db.transaction();
        organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)

    });

    afterEach(async () => {
        await transaction.rollback();
    });


    it('create user', async () => {
        const user = await service.create(organization.id, 'teste', 'testeUser', 'teste', 'employee', transaction)
        expect(user.organizationId).toBe(organization.id)
        expect(user.name).toBe('teste')
        expect(user.email).toBe('testeUser') 
        expect(user.role).toBe('employee') 
    })

})