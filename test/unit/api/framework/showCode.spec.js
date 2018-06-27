const { expect } = require('chai')

const showCode = require('src/api/framework/showCode')

const mockRequest = require('test/utils/mockRequest')
const mockResponse = require('test/utils/mockResponse')

describe('src/api/framework/showCode', () => {
  const res = mockResponse()
  const code = 'some-code'
  const req = mockRequest({ query: { code } })

  const resetStubs = () => {
    res.render.resetHistory()
  }

  before(() => {
    showCode(req, res)
  })

  after(resetStubs)

  it('called redirect', () => {
    expect(res.render).to.have.been.called
  })
})
