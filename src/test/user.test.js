const service = require("../services/User.js");
const serviceOrganization = require("../services/Organization.js");
const database = require("../DataBase.js");

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

  it('sucess', async() => {
    const deletedUser = await  service.delete(organization.id, user.id, transaction)
    expect(deletedUser.id).toBe(user.id)

  })
})