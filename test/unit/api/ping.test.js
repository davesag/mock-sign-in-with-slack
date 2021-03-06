const { expect } = require('chai')
const proxyquire = require('proxyquire')
const { mockRequest, mockResponse } = require('mock-req-res')

const { name, version, description } = require('package.json')

const fakeUptime = 100
const mockUptime = () => fakeUptime

const ping = proxyquire('src/api/ping', {
  'src/utils/uptime': mockUptime
})

describe('src/api/ping', () => {
  const req = mockRequest()
  const res = mockResponse()

  const expected = {
    name,
    description,
    version,
    uptime: fakeUptime
  }

  const resetStubs = () => {
    res.json.resetHistory()
  }

  before(() => {
    ping(req, res)
  })

  after(resetStubs)

  it('calls res.json with the correct data', () => {
    expect(res.json).to.have.been.calledWith(expected)
  })
})
