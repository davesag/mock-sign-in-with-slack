const { faker } = require('@faker-js/faker')

const fakeUser = (fields = {}) => {
  const firstName = fields.firstName || faker.name.firstName()
  const lastName = fields.lastName || faker.name.lastName()
  const name = fields.name || `${firstName} ${lastName}`
  const email = fields.email || faker.internet.exampleEmail(firstName, lastName)
  const extraScopes = faker.helpers.arrayElement([null, 'identity.email', 'admin'])
  const scopes = fields.scopes
    ? fields.scopes
    : fields.extraScopes
      ? ['identity.basic', ...fields.extraScopes]
      : extraScopes
        ? ['identity.basic', ...extraScopes]
        : ['identity.basic']
  const id = fields.id || faker.datatype.uuid()
  return {
    name,
    email,
    id,
    scopes
  }
}

module.exports = fakeUser
