const service = require('../services/session.js')
const database = require('../DataBase.js')
const serviceToken = require('../services/refreshToken.js')
const serviceOrganization = require('../services/Organization.js')
const serviceUser = require('../services/User.js')

describe("check if session is valid", () => {
    let transaction,
    token

    beforeEach(async () => {
        transaction = await database.db.transaction();
        const organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
        const password = organization.admin.password
        const login = await serviceUser.login(organization.email, password, transaction)
        token = login.token
    });

    afterEach(async () => {
        await transaction.rollback();
    });


    it('false', async () => {
        let currentDate = new Date(Date.now() + (86400000 * 7))
        currentDate = currentDate.getTime()
        const isSessionValid = await service.validateSession(token, currentDate, transaction)
        const {isValid} = await service.findSession(token, transaction)

        expect(isSessionValid).toBe(false)
        expect(isValid).toBe(false)

    })

    it('true', async () => {
        let currentDate = new Date().getTime()
        const isSessionValid = await service.validateSession(token, currentDate, transaction)
        const {isValid} = await service.findSession(token, transaction)

        expect(isSessionValid).toBe(true)
        expect(isValid).toBe(true)

    })


})