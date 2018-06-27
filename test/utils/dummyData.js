const faker = require('faker')

const userData = (fields = {}) => ({
  email: faker.internet.email(),
  token: faker.random.uuid(),
  admin: faker.random.boolean(),
  ...fields
})

module.exports = {
  userData
}
