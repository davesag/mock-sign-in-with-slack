const { expect } = require('chai')

const decodeBasic = require('src/helpers/decodeBasic')
const mockRequest = require('test/utils/mockRequest')

describe('src/helpers/decodeBasic', () => {
  let result

  context('when there is an auth header', () => {
    const clientId = 'client-id'
    const clientSecret = 'client-secret'
    const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const authorization = `Basic ${token}`
    const req = mockRequest({ headers: { authorization } })

    before(() => {
      result = decodeBasic(req)
    })

    it('decoded correctly', () => {
      expect(result).to.have.property('clientId', clientId)
      expect(result).to.have.property('clientSecret', clientSecret)
    })
  })

  context('when there is no auth header', () => {
    const req = mockRequest()

    before(() => {
      result = decodeBasic(req)
    })

    it('decoded correctly', () => {
      expect(result).not.to.have.property('clientId')
      expect(result).not.to.have.property('clientSecret')
    })
  })
})
