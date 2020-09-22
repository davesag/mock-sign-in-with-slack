const { expect } = require('chai')
const request = require('supertest')
const { get } = require('test/utils/serverCache')

const fakeUser = require('test/utils/fakeUser')

const { usersByToken } = require('src/utils/store')

describe('POST /api/auth.revoke', () => {
  const token = 'some-token'
  const user = fakeUser()

  before(() => {
    usersByToken.set(token, user)
  })

  after(() => {
    usersByToken.reset()
  })

  it('returns an Okay result and status code 200', async () => {
    const res = await request(get()).post(`/api/auth.revoke?token=${token}`).expect(200)

    expect(res.body).to.have.property('ok', true)
    expect(res.body).to.have.property('revoked', true)
    expect(usersByToken.get(token)).to.be.undefined
  })
})
