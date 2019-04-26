const { expect } = require('chai')
const { mockRequest, mockResponse } = require('mock-req-res')

const showCode = require('src/api/framework/showCode')

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
