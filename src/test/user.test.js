const service = require("../services/User.js");
const serviceOrganization = require("../services/Organization.js");
const database = require("../DataBase.js");
const security = require('../services/crypto.js')
const serviceSession = require('../services/session.js')
const repository = require("../repository/repository.js")

describe("create user test", () => {
  let transaction;
  let organization;

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it("success", async () => {
    const fields = {
      organization,
      name: "teste",
      email: "testeUser",
      password: "teste",
      role: "employee",
    };
    const user = await service.create(fields, transaction);
    
    expect(user.organizationId).toBe(organization.id);
    expect(user.name).toBe("teste");
    expect(user.email).toBe("testeUser");
    expect(user.role).toBe("employee");
  });

  it("fail for no organization in provided id", async () => {
    const fields = {
      organization: "fakeOrganization",
      name: "teste",
      email: "testeUser",
      password: "teste",
      role: "employee",
    };
    const user = service.create(fields, transaction);
    await expect(user).rejects.toThrow("organization not found");
  });

  it("fail because a property have a not unique value", async () => {
    const fields = {
      organization,
      name: "teste",
      email: "teste",
      password: "teste",
      role: "employee",
    };
    const user = service.create(fields, transaction);
    try {
      await user;
    } catch (err) {
      expect(err.name).toMatch(/SequelizeUniqueConstraintError/);
    }
  });

  it("fail because a field not provided", async () => {
    const fields = {
      organization: organization,
      name: "teste",
      email: "email",
      password: "teste",
      role: "employee",
    };

    for (const field in fields) {
      if (field === "organization") {
        return;
      }
      fields[field] = null;
      const user = service.create(fields, transaction);
      await expect(user).rejects.toThrow(`please give a ${field}`);
    }
  });

  it("fail beacause a invalid role", async () => {
    const fields = {
      organization: organization,
      name: "teste",
      email: "testeUser",
      password: "teste",
      role: "invalidRole",
    };
    const user = service.create(fields, transaction);
    await expect(user).rejects.toThrow("invalid role");
  });
});

describe("find one user test", () => {
  let transaction;
  let organization;

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it("success", async () => {
    const user = await service.create(
      {
        organization: organization,
        name: "teste",
        email: "testeUser",
        password: "teste",
        role: "employee",
      },
      transaction
    );

    const findUser = await service.findOne(
      user.organizationId,
      user.id,
      transaction
    );

    console.log(findUser)
    expect(findUser.name).toBe(user.name);
    expect(findUser.email).toBe(user.email);
    expect(findUser.role).toBe(user.role);
    expect(findUser.id).toBe(user.id);
    expect(findUser.organization.name).toBe(user.organization.name);
  });

  it("fail for organization not found", async () => {
    const user = await service.create(
      {
        organization: organization,
        name: "teste",
        email: "testeUser",
        password: "teste",
        role: "employee",
      },
      transaction
    );
    const findUser = service.findOne(9999, user.id, transaction);
    await expect(findUser).rejects.toThrow("no organization in this id");
  });

  it("fail for user not found", async () => {
    const user = await service.create(
      {
        organization: organization,
        name: "teste",
        email: "testeUser",
        password: "teste",
        role: "employee",
      },
      transaction
    );
    const findUser = service.findOne(organization.id, 9999, transaction);
    await expect(findUser).rejects.toThrow(
      "no user with this id in this organization"
    );
  });

  it("fail for id invalid or not a number not found", async () => {
    const user = await service.create(
      {
        organization: organization,
        name: "teste",
        email: "testeUser",
        password: "teste",
        role: "employee",
      },
      transaction
    );
    for (let i = 0; i < 2; i++) {
      const userId = [null, "string"];
      const findUser = service.findOne(organization.id, userId[i], transaction);
      await expect(findUser).rejects.toThrow("invalid userId");
    }

  });
});

describe("find all test", () => {
  let transaction;
  let organization;

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it("success", async () => {
    for (let i = 1; i < 5; i++) {
      const data = {
        organization,
        name: `teste` + i,
        email: `testeUser` + i,
        password: `teste`,
        role: `employee`,
      };
      await service.create(data, transaction);
    }
    const users = await service.findAll(organization.id, transaction);
    console.log(users)
    users.forEach((user, index) => {
      if (index === 0) {
        expect(user.name).toBe(`Admin teste`);
        expect(user.email).toBe(`teste`);
        expect(user.role).toBe(`admin`);
      } else {
        expect(user.name).toBe(`teste${users.indexOf(user)}`);
        expect(user.email).toBe(`testeUser${users.indexOf(user)}`);
        expect(user.role).toBe(`employee`);
      }
    });
  });

  it("fail for organization not found", async () => {
    for (let i = 1; i < 5; i++) {
      const data = {
        organization,
        name: `teste` + i,
        email: `testeUser` + i,
        password: `teste`,
        role: `employee`,
      };
      await service.create(data, transaction);
    }
    const findUser = service.findAll(9999, transaction);
    await expect(findUser).rejects.toThrow("no organization in this id");
  });
});

describe("delete test", () => {
  let transaction;
  let organization;
  let user

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );

    user = await service.create({
      organization,
      name: `teste`,
      email: `testeUser`,
      password: `teste`,
      role: `employee`,
    }, transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('sucess', async () => {
    const deletedUser = await service.delete(user, transaction)
    const findUser = service.findOne(organization.id, deletedUser.id, transaction)
    expect(deletedUser.id).toBe(user.id)
    await expect(findUser).rejects.toThrow('no user with this id in this organization')

  })

})

describe("login test", () => {
  let transaction;
  let organization;
  let user

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );

    user = await service.create({
      organization,
      name: `teste`,
      email: `testeUser`,
      password: `teste`,
      role: `employee`,
    }, transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('sucess', async () => {
    const login = await service.login(user.email, "teste", transaction)
    const { token } = login
    const decoded = security.verifyJwt(token)
    const { id, organizationId, role } = decoded.decoded
    expect(id).toBe(user.id)
    expect(organizationId).toBe(user.organizationId)
    expect(role).toBe(user.role)
  })

  it('failed because it could not find a user with the email provided', async () => {
    const login = service.login('invalidEmail', "teste", transaction)
    await expect(login).rejects.toThrow('invalid email or password')
  })

  it('failed because invalid password', async () => {
    const login = service.login(user.email, "invalidPassword", transaction)
    await expect(login).rejects.toThrow('invalid email or password')
  })


})

describe("logout test", () => {
  let transaction;
  let organization;
  let user
  let login

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );

    user = await service.create({
      organization,
      name: `teste`,
      email: `testeUser`,
      password: `teste`,
      role: `employee`,
    }, transaction)

    login = await service.login(user.email, 'teste', transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('success', async () => {
    const { token, refreshToken} = login
    const logout = await service.logout(token, refreshToken, transaction)
    const session = await serviceSession.findSession(token, transaction)
    expect(logout.id).toBe(session.id)
    expect(logout.isValid).toBe(session.isValid)

  })

  it('failed because there is no session bound to jwt or the session is invalid', async () => {
    const {refreshToken} = login
    const logout = service.logout("99999", refreshToken, transaction)
    await expect(logout).rejects.toThrow("session invalid")


  })

  it('failed because refresh token is invalid', async () => {
    const {token} = login
    const logout = service.logout(token, "99999", transaction)
    await expect(logout).rejects.toThrow("permission denied")


  })
})

describe("verify test", () => {
  let transaction;
  let organization;
  let user
  let login

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );

    user = await service.create({
      organization,
      name: `teste`,
      email: `testeUser`,
      password: `teste`,
      role: `employee`,
    }, transaction)

    login = await service.login(user.email, 'teste', transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('success', async () => {
    const { token } = login
    const decoded = security.verifyJwt(token)
    console.log(decoded.decoded)
    const verify = await service.verify(decoded.decoded.id, decoded.decoded.role, transaction)
    expect(verify.id).toBe(decoded.decoded.id)
    expect(verify.role).toBe(decoded.decoded.role)
  })

  
  it('fail for invalid id', async () => {
    const { token } = login
    const decoded = security.verifyJwt(token)
    const verify = await service.verify(99999, decoded.decoded.role, transaction)
    expect(verify).toBe(null)
  })

  it('fail for invalid role', async () => {
    const { token } = login
    const decoded = security.verifyJwt(token)
    const verify = await service.verify(decoded.decoded.id, 'invalid role', transaction)
    expect(verify).toBe(null)
  })
})

describe("get new jwt test", () => {
  let transaction;
  let organization;
  let user
  let login,
    session

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create(
      "teste",
      "teste",
      "teste",
      "teste",
      transaction
    );

    user = await service.create({
      organization,
      name: `teste`,
      email: `testeUser`,
      password: `teste`,
      role: `employee`,
    }, transaction)

    login = await service.login(user.email, 'teste', transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('success', async () => {
    const token = login.token
    session = await serviceSession.findSession(token, transaction)
    const idSession = session.id
    const refreshToken = login.refreshToken
    const getNewJwt = await service.getNewJwt(session, refreshToken, transaction)
    session = await serviceSession.findSession(getNewJwt, transaction)

    
    expect(session.id).toBe(idSession)
    expect(getNewJwt).toBe(session.jwt)


  })

})

