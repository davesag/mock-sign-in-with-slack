const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const mockRequest = require('test/utils/mockRequest')
const mockResponse = require('test/utils/mockResponse')

describe('src/api/v1/identity', () => {
  const res = mockResponse()
  const mockCache = sinon.stub()

  const mockStore = {
    usersByToken: {
      get: mockCache
    }
  }

  const identity = proxyquire('src/api/v1/identity', {
    'src/utils/store': mockStore
  })

  const resetStubs = () => {
    mockCache.resetHistory()
    res.json.resetHistory()
  }

  context('all is good', () => {
    const token = 'a-token'
    const user = { data: 'some-user' }
    const req = mockRequest({ query: { token } })

    before(() => {
      mockCache.returns(user)
      identity(req, res)
    })

    after(resetStubs)

    it('called json', () => {
      expect(res.json).to.have.been.calledWith(
        sinon.match({
          ok: true,
          user
        })
      )
    })
  })

  context('something went wrong', () => {
    context('the token is missing', () => {
      const req = mockRequest({ query: {} })

      after(resetStubs)

      it('throws', () => expect(() => identity(req, res)).to.throw())
    })

    context('the the token is wrong', () => {
      const req = mockRequest({ query: { token: 'something' } })

      before(() => {
        mockCache.returns()
      })

      after(resetStubs)

      it('throws', () => expect(() => identity(req, res)).to.throw())
    })
  })
})
