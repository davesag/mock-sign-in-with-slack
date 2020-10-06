const request = require('supertest')
const { get } = require('test/utils/serverCache')

const { usersByToken } = require('src/utils/store')

const fakeUser = require('test/utils/fakeUser')

describe('GET /api/users.identity', () => {
  const token = 'some-token'
  const { scopes, ...user } = fakeUser({ extraScopes: ['identity.email'] })

  const expected = {
    ok: true,
    user
  }

  before(() => {
    usersByToken.set(token, { scopes, ...user })
  })

  after(() => {
    usersByToken.reset()
  })

  context('given a valid token', () => {
    it('returns an Okay result and status code 200', async () =>
      request(get()).get(`/api/users.identity?token=${token}`).expect(200, expected))
  })
})
