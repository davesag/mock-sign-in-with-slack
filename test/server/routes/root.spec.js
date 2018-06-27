const { expect } = require('chai')
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
      .end((err, res) => {
        expect(err).to.not.exist
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal(expected)
        done()
      })
  })
})
