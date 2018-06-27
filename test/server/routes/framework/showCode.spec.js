const request = require('supertest')
const { get } = require('test/server/serverCache')

describe('GET /show-code', () => {
  const code = 'some-token'

  context('given valid data', () => {
    it('shows a code', done => {
      request(get())
        .get(`/show-code?code=${code}`)
        .expect(200)
        .end(done)
    })
  })
})
