const { expect } = require('chai')
const request = require('supertest')
const { get } = require('test/server/serverCache')
const { name, version, description } = require('package.json')

describe('GET /ping', () => {
  it('returns an Okay result and status code 200', done => {
    request(get())
      .get('/ping')
      .expect(200)
      .end((err, res) => {
        expect(err).to.not.exist
        expect(res.body).to.have.property('name', name)
        expect(res.body).to.have.property('description', description)
        expect(res.body).to.have.property('version', version)
        expect(res.body).to.have.property('uptime')
        done()
      })
  })
})
