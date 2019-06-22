const request = require('supertest')
const { get } = require('test/utils/serverCache')
const { CLIENT_ID, REDIRECT_URI } = require('src/utils/config')

const { usersById, usersByToken, tokensByCode } = require('src/utils/store')

const fakeUser = require('test/utils/fakeUser')

describe('POST /login', () => {
  const { scopes, id, ...user } = fakeUser({ extraScopes: ['identity.email'] })

  const body = {
    client_id: CLIENT_ID,
    scope: scopes.join(','),
    // state,
    name: user.name,
    email: user.email
  }

  const expected = new RegExp(REDIRECT_URI)

  after(() => {
    usersById.reset()
    tokensByCode.reset()
    usersByToken.reset()
  })

  context('given valid data', () => {
    it('redirects correctly with a code', async () =>
      request(get())
        .post('/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(body)
        .expect(302)
        .expect('Location', expected))
  })
})
