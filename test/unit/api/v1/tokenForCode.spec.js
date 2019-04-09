const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { mockRequest, mockResponse } = require('mock-req-res')

const { CLIENT_ID, CLIENT_SECRET, TEAM_ID } = require('src/utils/config')

describe('src/api/v1/tokenForCode', () => {
  const res = mockResponse()
  const mockTokenCache = sinon.stub()
  const mockUserCache = sinon.stub()

  const mockDecoder = sinon.stub()

  const mockStore = {
    usersByToken: {
      get: mockUserCache
    },
    tokensByCode: {
      get: mockTokenCache
    }
  }

  const tokenForCode = proxyquire('src/api/v1/tokenForCode', {
    'src/utils/store': mockStore,
    'src/helpers/decodeBasic': mockDecoder
  })

  const resetStubs = () => {
    mockTokenCache.resetHistory()
    mockUserCache.resetHistory()
    res.json.resetHistory()
    mockDecoder.resetHistory()
  }

  const clientId = CLIENT_ID
  const clientSecret = CLIENT_SECRET
  const code = 'a code'
  const token = 'some token'

  context('all is good', () => {
    const scopes = ['identity.basic']

    context('secrets in params', () => {
      const req = mockRequest({
        query: { code, client_id: clientId, client_secret: clientSecret }
      })

      before(() => {
        mockDecoder.returns({})
        mockTokenCache.returns(token)
        mockUserCache.returns({ scopes })
        tokenForCode(req, res)
      })

      after(resetStubs)

      it('called json', () => {
        expect(res.json).to.have.been.calledWith(
          sinon.match({
            ok: true,
            access_token: token,
            scope: scopes.join(','),
            team_id: TEAM_ID
          })
        )
      })

      context('secrets in header', () => {
        const req = mockRequest({ query: { code } })

        before(() => {
          mockDecoder.returns({ clientId, clientSecret })
          mockTokenCache.returns(token)
          mockUserCache.returns({ scopes })
          tokenForCode(req, res)
        })

        after(resetStubs)

        it('called json', () => {
          expect(res.json).to.have.been.calledWith(
            sinon.match({
              ok: true,
              access_token: token,
              scope: scopes.join(','),
              team_id: TEAM_ID
            })
          )
        })
      })
    })
  })

  context('something went wrong', () => {
    context('missing code', () => {
      const req = mockRequest({
        query: { client_id: clientId, client_secret: clientSecret }
      })

      before(() => {
        mockDecoder.returns({})
        mockTokenCache.returns(token)
      })

      after(resetStubs)

      it('throws', () => expect(() => tokenForCode(req, res)).to.throw())
    })

    context('bad code', () => {
      const req = mockRequest({
        query: { code, client_id: clientId, client_secret: clientSecret }
      })

      before(() => {
        mockDecoder.returns({})
        mockTokenCache.returns()
      })

      after(resetStubs)

      it('throws', () => expect(() => tokenForCode(req, res)).to.throw())
    })

    context('bad client_id', () => {
      const req = mockRequest({
        query: { code, client_id: 'nonsense', client_secret: clientSecret }
      })

      before(() => {
        mockDecoder.returns({})
      })

      after(resetStubs)

      it('throws', () => expect(() => tokenForCode(req, res)).to.throw())
    })

    context('bad client_secret', () => {
      const req = mockRequest({
        query: { code, client_id: clientId, client_secret: 'nonsense' }
      })

      before(() => {
        mockDecoder.returns({})
      })

      after(resetStubs)

      it('throws', () => expect(() => tokenForCode(req, res)).to.throw())
    })
  })
})
