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
        const token = await service.createToken(this.transaction)
        const findToken = await service.findToken(token.id, this.transaction)

        expect(findToken.id).toBe(token.id)
        expect(findToken.isValid).toBe(true)
    })

    it('deletar token', async () => {
        const token = await service.createToken(this.transaction)
        const deletedToken = await service.deleteToken(token.id, this.transaction)
        const findToken = service.findToken(deletedToken.id, this.transaction)

        await expect(findToken).rejects.toThrow('refresh Token not found or not provided')


    })


    it('change token validate', async () => {
        const token = await service.createToken(this.transaction)
        const newToken = await service.changeValidateToken(token.id, this.transaction)

        expect(newToken.isValid).toBe(false)

    })


})