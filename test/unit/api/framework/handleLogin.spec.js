const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const { REDIRECT_URI, CLIENT_ID } = require('src/utils/config')

const mockRequest = require('test/utils/mockRequest')
const mockResponse = require('test/utils/mockResponse')
const mockUuid = require('test/utils/mockUuid')

describe('src/api/framework/handleLogin', () => {
  const mockMakeUser = sinon.stub()

  const handleLogin = proxyquire('src/api/framework/handleLogin', {
    uuid: mockUuid,
    'src/helpers/makeUser': mockMakeUser
  })

  const res = mockResponse()

  const clientId = CLIENT_ID
  const scope = 'identity.basic'
  const redirectUri = REDIRECT_URI
  const name = 'name'
  const email = 'email@test.tes'

  const body = {
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    // state,
    name,
    email
  }

  const resetStubs = () => {
    res.redirect.resetHistory()
    mockUuid.v4.resetHistory()
    mockMakeUser.resetHistory()
  }

  mockMakeUser.returns('user')
  mockUuid.v4.returns('some-cool-id')

  context('all is good', () => {
    const req = mockRequest({ body })

    before(() => {
      handleLogin(req, res)
    })

    after(resetStubs)

    it('called redirect', () => {
      expect(res.redirect).to.have.been.called
    })
  })

  context('something went wrong', () => {
    context('the client id is missing', () => {
      const badBody = { ...body, client_id: undefined }
      const req = mockRequest({ body: badBody })

      after(resetStubs)

      it('throws', () => expect(() => handleLogin(req, res)).to.throw())
    })

    context('the client id is wrong', () => {
      const badBody = { ...body, client_id: 'something wrong' }
      const req = mockRequest({ body: badBody })

      after(resetStubs)

      it('throws', () => expect(() => handleLogin(req, res)).to.throw())
    })

    context('the redirect_uri is wrong', () => {
      const badBody = { ...body, redirect_uri: 'oops' }
      const req = mockRequest({ body: badBody })

      after(resetStubs)

      it('throws', () => expect(() => handleLogin(req, res)).to.throw())
    })

    context('the scope is bad', () => {
      const badBody = { ...body, scope: 'oops' }
      const req = mockRequest({ body: badBody })

      after(resetStubs)

      it('throws', () => expect(() => handleLogin(req, res)).to.throw())
    })
  })
})
