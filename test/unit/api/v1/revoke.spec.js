const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const mockRequest = require('test/utils/mockRequest')
const mockResponse = require('test/utils/mockResponse')

describe('src/api/v1/revoke', () => {
  const res = mockResponse()
  const mockCache = sinon.stub()

  const mockStore = {
    usersByToken: {
      clear: mockCache
    }
  }

  const revoke = proxyquire('src/api/v1/revoke', {
    'src/utils/store': mockStore
  })

  const resetStubs = () => {
    mockCache.resetHistory()
    res.json.resetHistory()
  }

  context('all is good', () => {
    const token = 'a-token'
    const req = mockRequest({ query: { token } })

    before(() => {
      mockCache.returns()
      revoke(req, res)
    })

    after(resetStubs)

    it('called json', () => {
      expect(res.json).to.have.been.calledWith(
        sinon.match({
          ok: true,
          revoked: true
        })
      )
    })
  })

  context('something went wrong', () => {
    context('the token is missing', () => {
      const req = mockRequest({ query: {} })

      after(resetStubs)

      it('throws', () => expect(() => revoke(req, res)).to.throw())
    })
  })
})
