const { expect } = require('chai')

const { REDIRECT_URI, CLIENT_ID } = require('src/utils/config')

const mockRequest = require('test/utils/mockRequest')
const mockResponse = require('test/utils/mockResponse')

const authorize = require('src/api/v1/authorize')

describe('src/api/v1/authorize', () => {
  const res = mockResponse()

  const clientId = CLIENT_ID
  const scope = 'identity.basic'
  const redirectUri = REDIRECT_URI

  const query = {
    client_id: clientId,
    scope,
    redirect_uri: redirectUri
  }

  const resetStubs = () => {
    res.render.resetHistory()
  }

  context('all is good', () => {
    const req = mockRequest({ query })

    before(() => {
      authorize(req, res)
    })

    after(resetStubs)

    it('called render', () => {
      expect(res.render).to.have.been.called
    })
  })

  context('something went wrong', () => {
    context('the client id is missing', () => {
      const badQuery = { ...query, client_id: undefined }
      const req = mockRequest({ query: badQuery })

      after(resetStubs)

      it('throws', () => expect(() => authorize(req, res)).to.throw())
    })

    context('the client id is wrong', () => {
      const badQuery = { ...query, client_id: 'something wrong' }
      const req = mockRequest({ query: badQuery })

      after(resetStubs)

      it('throws', () => expect(() => authorize(req, res)).to.throw())
    })

    context('the redirect_uri is wrong', () => {
      const badQuery = { ...query, redirect_uri: 'oops' }
      const req = mockRequest({ query: badQuery })

      after(resetStubs)

      it('throws', () => expect(() => authorize(req, res)).to.throw())
    })

    context('the scope is bad', () => {
      const badQuery = { ...query, scope: 'oops' }
      const req = mockRequest({ query: badQuery })

      after(resetStubs)

      it('throws', () => expect(() => authorize(req, res)).to.throw())
    })
  })
})
