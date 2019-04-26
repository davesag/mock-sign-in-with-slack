const request = require('supertest')
const { get } = require('test/server/serverCache')
const { CLIENT_ID, CLIENT_SECRET, TEAM_ID } = require('src/utils/config')

const { tokensByCode, usersByToken } = require('src/utils/store')

const fakeUser = require('test/server/fakeUser')

describe('GET /api/oauth.access', () => {
  const scope = 'identity.basic'
  const authToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    'base64'
  )
  const authorization = `Basic ${authToken}`
  const code = 'some-code'
  const token = 'some-token'
  const user = fakeUser({ scopes: [scope] })

  const expected = {
    ok: true,
    access_token: token,
    scope,
    team_id: TEAM_ID
  }

  before(() => {
    tokensByCode.set(code, token)
    usersByToken.set(token, user)
  })

  after(() => {
    tokensByCode.reset()
    usersByToken.reset()
  })

  context('passed client id and secret in header', () => {
    it('returns an Okay result and status code 200', done => {
      request(get())
        .get(`/api/oauth.access?code=${code}`)
        .set('Authorization', authorization)
        .expect(200, expected)
        .end(done)
    })
  })

  context('passed client id and secret in params', () => {
    it('returns an Okay result and status code 200', done => {
      request(get())
        .get(
          `/api/oauth.access?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        )
        .expect(200, expected)
        .end(done)
    })
  })
})
