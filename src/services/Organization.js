
class ServiceOrganization {
  constructor(error, serviceUser, repositoryOrganization, crypto) {
    this.repository = repositoryOrganization
    this.error = error
    this.serviceUser = serviceUser
    this.security = crypto
  }

  async findOne(id, transaction) {
    if (!id || isNaN(id)) {
      throw this.error("id incorrect");
    }
    const organization = await this.repository.findOne({id}, transaction)

    if (!organization) {
      throw this.error("no organization in this id");
    }
    return organization;
  }

  async create(name, address, phone, email, transaction) {
    const fields = {
      name: name,
      address: address,
      phone: phone,
      email: email,
    };
    for (const fieldName in fields) {
      if (!fields[fieldName]) {
        throw this.error(`${fieldName} invalid or not provided`);
      }
    }
  const organization = await this.repository.create( {name, address, phone, email} , transaction );
    
    
    const password = this.security.randomicPass()

    let admin = await this.serviceUser.create({
      organization,
      name: `Admin ${organization.name}`,
      email,
      password,
      role: "admin"},
      transaction
    );
    admin = JSON.parse(JSON.stringify(admin));

    admin.password = password;
    delete admin.organization;
    delete admin.organizationId;

    return { ...organization.dataValues, admin };
  }

  async update(id, field, value, transaction) {
    if(!value) {
      throw this.error('set a value to modification')
    }
    const fields = ['name', 'address', 'phone', 'email']

    if(!(fields.includes(field))) {
      throw this.error('field not valid or not provided')
    }
    const organization = await this.repository.findOne( {id}, transaction);
    if (!organization) {
      throw this.error("no organization in this id");
    }
    return this.repository.update(organization, field, value, transaction)
  }

  async delete(id, transaction) {
    if (!id || isNaN(id)) {
      throw this.error("Invalid or not provided ID.");
    }
    const organization = await this.repository.findOne({id}, transaction);
    const users = await this.serviceUser.findAll(id, transaction)
    
      await Promise.all(users.map( (user) => {
         return this.serviceUser.delete(user, transaction)
      }))

    return this.repository.delete(organization, transaction)
  }
  
}

module.exports = ServiceOrganization
