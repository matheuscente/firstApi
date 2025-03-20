
const database = require("../DataBase.js");
const error = require("../fns/error.js");
const serviceOrganization = require("../services/Organization.js");

describe("create organization", () => {
  let transaction

  beforeEach(async () => {
    transaction = await database.db.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it("sucess", async () => {
    const organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
      expect(organization.name).toBe('teste');
      expect(organization.address).toBe('teste');
      expect(organization.phone).toBe('teste');
      expect(organization.email).toBe('teste');

  });

  it("fail because a property not defined", async () => {
    const names = ["name", "address", "phone", "email"];
    for (let i = 0; i <= 3; i++) {
      const test = {
        name: "teste",
        address: "teste",
        phone: "teste",
        email: "teste",
      };
      test[names[i]] = null;

      const organization = serviceOrganization.create(
        test.name,
        test.address,
        test.phone,
        test.email,
        transaction
      );

      await expect(organization).rejects.toThrow(
        `${names[i]} invalid or not provided`
      );
    }
  });

  it("fail because a property have a not unique value", async () => {
    await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
    const testCases = [
      { phone: "teste", email: "email" },
      { phone: "phone", email: "teste" },
    ];

    for (const test of testCases) {
      const organization = serviceOrganization.create(
        "teste",
        "teste",
        test.phone,
        test.email,
        transaction
      );
      try {
        await organization;
      } catch (err) {
        expect(err.name).toMatch(/SequelizeUniqueConstraintError/);
      }
    }
  });
});

describe('find one organization', () => {
  let transaction,
   organization 

  beforeEach(async () => {
    transaction = await database.db.transaction();
    organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('sucess', async () => {
    const findOrg = await serviceOrganization.findOne(organization.id, transaction)
    expect(findOrg.id).toBe(organization.id)
  })

  it('fail beacuse no have organizations in provided id', async () => {
    const findOrg = serviceOrganization.findOne(99999, transaction)
    
      await expect(findOrg).rejects.toThrow('no organization in this id')
    
  })

  it('fail beacuse id is NaN', async () => {
    const findOrg = serviceOrganization.findOne('s', transaction)
    
      await expect(findOrg).rejects.toThrow('id incorrect')
  })

  it('fail beacuse id is not provided', async () => {
    const findOrg = serviceOrganization.findOne(null, transaction)
    
      await expect(findOrg).rejects.toThrow('id incorrect')
  })



})

describe('delete organization', () => {
  let transaction,
  organization 

 beforeEach(async () => {
   transaction = await database.db.transaction();
   organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
 });

 afterEach(async () => {
   await transaction.rollback();
 });

 it('success', async () => {
  const deletedOrg = await serviceOrganization.delete(organization.id, transaction)
  const findOrganization = serviceOrganization.findOne(organization.id, transaction)
  
  await expect(findOrganization).rejects.toThrow('no organization in this id')
 })

 it('fail for not found organizations', async () => {
    const deletedOrg = serviceOrganization.delete(999999, transaction)
    await expect(deletedOrg).rejects.toThrow('no organization in this id')
 })

 it('fail for null id', async () => {
  const deletedOrg = serviceOrganization.delete(null, transaction)
  await expect(deletedOrg).rejects.toThrow('Invalid or not provided ID.')
})

it('fail for NaN id', async () => {
  const deletedOrg =  serviceOrganization.delete('abc', transaction)
  await expect(deletedOrg).rejects.toThrow('Invalid or not provided ID.')
})
})

describe('update organization', () => {
    let transaction,
    organization 
  
   beforeEach(async () => {
     transaction = await database.db.transaction();
     organization = await serviceOrganization.create('teste', 'teste', 'teste', 'teste', transaction)
   });
  
   afterEach(async () => {
     await transaction.rollback();
   });

   it('sucess', async () => {
    const update = 'update'
    const values = {
      name: 'teste',
      address: 'teste',
      phone: 'teste',
      email: 'teste'
    }

    for(const value in values) {
      const updatedOrg = await serviceOrganization.update(organization.id, value, update, transaction)
      const testField = updatedOrg[value]
      expect(testField).toBe(update)
    }
   })
   
   it('fail for not found organizations', async () => {
    const deletedOrg = serviceOrganization.update(999999, 'name', 'test', transaction)
    await expect(deletedOrg).rejects.toThrow('no organization in this id')
 })

 it('fail for not provide value', async () => {
  const uptadeOrg = serviceOrganization.update(organization.id, 'name', null, transaction)
  await expect(uptadeOrg).rejects.toThrow('set a value to modification')
})

it('fail for not provide field', async () => {
 const uptadeOrg = serviceOrganization.update(organization.id, null, 'teste', transaction)
 await expect(uptadeOrg).rejects.toThrow('set a field to modification')
})

it('fail for invalid field', async () => {
  const uptadeOrg = serviceOrganization.update(organization.id, 'test', 'teste', transaction)
  await expect(uptadeOrg).rejects.toThrow('field not valid')
 })

 it('fail for unique violation', async () => {
  const fields = ['phone', 'email']
  for(let i = 0; i < 2; i ++) {
    const uptadeOrg = serviceOrganization.update(organization.id, 'name', 'teste', transaction)
    try {
      await uptadeOrg
    } catch(err) {
      console.log(err)
      expect(err.name).toMatch(/SequelizeUniqueConstraintError/)
    }
  }
  
  
 })

 it('fail if field is id', async () => {
    const uptadeOrg = serviceOrganization.update(organization.id, 'id', 999999, transaction)

      await expect(uptadeOrg).rejects.toThrow('changing the id is not allowed')
  })

})

