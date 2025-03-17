const service = require('../services/refreshToken.js')
const database = require('../DataBase.js')

describe("token test", () => {
    let transaction; 

    beforeEach(async () => {
        transaction = await database.db.transaction();
    });

    afterEach(async () => {
        await transaction.rollback();
    });


    it('achar token', async () => {
        const token = await service.createToken(transaction)

        const findToken = await service.findToken(token[0].id, transaction)
        expect(findToken.id).toBe(token[0].id)
    })

    it('deletar token', async () => {
        const token = await service.createToken(transaction)

        const deletedToken = await service.deleteToken(token[0].id, transaction)
        const findToken = service.findToken(deletedToken.id, transaction)

        await expect(findToken).rejects.toThrow('refresh Token not found or not provided')


    })


    it('check token validate', async () => {
        const token = await service.createToken(this.transaction)
        const isTokenValid = await service.isTokenValid(token[0].id, this.transaction)

        expect(isTokenValid).toBe(true)
    })


})