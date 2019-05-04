const request = require('supertest')
const { get } = require('test/utils/serverCache')

describe('GET /show-code', () => {
  const code = 'some-token'

  context('given valid data', () => {
    it('shows a code', async () =>
      request(get())
        .get(`/show-code?code=${code}`)
        .expect(200))
  })
})
