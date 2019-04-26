const request = require('supertest')
const { get } = require('test/server/serverCache')
const { CLIENT_ID } = require('src/utils/config')

describe('GET /oauth/authorize', () => {
  const scope = 'identity.basic'

  it('returns an Okay result and status code 200', done => {
    request(get())
      .get(`/oauth/authorize?scope=${scope}&client_id=${CLIENT_ID}`)
      .expect(200)
      .end(done)
  })
})
