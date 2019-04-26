const request = require('supertest')
const { get } = require('test/server/serverCache')

describe('GET /', () => {
  const expected = [
    {
      version: 1,
      path: '/api/v1'
    }
  ]

  it('returns the expected values with status code 200', done => {
    request(get())
      .get('/')
      .expect(200, expected)
      .end(done)
  })
})
