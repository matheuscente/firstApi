const service = require('../services/session.js')
const database = require('../DataBase.js')
const serviceToken = require('../services/refreshToken.js')

describe("session test", () => {
    let transaction; 

    beforeEach(async () => {
        transaction = await database.db.transaction();
    });

    afterEach(async () => {
        await transaction.rollback();
    });


    it('check if session is valid ', async () => {
        const userId = 1
        const jwt = 123
        const token = await serviceToken.createToken(transaction)
        console.log(jwt, userId, token[0].id)
        await service.create(jwt, token[0].id, userId, transaction)
        const isSessionValid = service.validateSession(jwt)

        expect(isSessionValid).toBe(true)
    })
})