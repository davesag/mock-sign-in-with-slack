const { expect } = require('chai')
const { spy } = require('sinon')

const shutdown = require('src/utils/shutdown')

describe('src/utils/shutdown', () => {
  const close = spy()
  const server = { close }

  const resetStubs = () => {
    close.resetHistory()
  }

  const serverClose = shutdown(server)

  before(() => {
    serverClose()
  })

  after(resetStubs)

  it('calls server.close', () => {
    expect(close).to.have.been.calledOnce
  })
})
