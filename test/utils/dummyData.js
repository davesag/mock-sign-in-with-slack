const faker = require('@faker-js/faker')

const userData = (fields = {}) => ({
  email: faker.internet.email(),
  token: faker.datatype.uuid(),
  admin: faker.random.boolean(),
  ...fields
})

module.exports = {
  userData
}
