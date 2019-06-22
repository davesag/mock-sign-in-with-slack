const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const mockApp = { listen: sinon.stub() }
const mockMakeApp = sinon.stub()

const server = proxyquire('src/server', {
  'src/utils/appMaker': mockMakeApp
})

const mockServer = 'a server'

describe('src/server', () => {
  let outcome

  before(async () => {
    mockMakeApp.returns(mockApp)
    mockApp.listen.resolves(mockServer)
    outcome = await server.start()
  })

  after(() => {
    mockMakeApp.resetHistory()
    mockApp.listen.resetHistory()
  })

  it('invoked app.listen', () => {
    expect(mockApp.listen).to.have.been.calledOnce
  })

  it('returns the server', () => {
    expect(outcome).to.have.property('server', mockServer)
  })
})
