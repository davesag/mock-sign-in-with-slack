const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const mockLogger = require('test/utils/mockLogger')

describe('src/utils/seedUsers', () => {
  const mockStore = {
    usersById: {
      set: sinon.spy(),
      reset: sinon.spy()
    },
    usersByToken: {
      set: sinon.spy(),
      reset: sinon.spy()
    },
    tokensByCode: {
      set: sinon.spy(),
      reset: sinon.spy()
    }
  }

  const seedUsers = proxyquire('src/utils/seedUsers', {
    'src/utils/logger': mockLogger,
    'src/utils/store': mockStore
  })

  const resetStubs = () => {
    mockLogger.error.resetHistory()
    mockStore.usersById.set.resetHistory()
    mockStore.usersById.reset.resetHistory()
    mockStore.usersByToken.set.resetHistory()
    mockStore.usersByToken.reset.resetHistory()
    mockStore.tokensByCode.set.resetHistory()
    mockStore.tokensByCode.reset.resetHistory()
  }

  context('happy', () => {
    const data =
      'W3sibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEB0ZXN0LnRlcyIsInNjb3BlcyI6WyJpZGVudGl0eS5iYXNpYyIsImlkZW50aXR5LmVtYWlsIl0sImNvZGUiOiJhYmNkLTEyMyJ9LHsibmFtZSI6IlRlc3QgQWRtaW4iLCJlbWFpbCI6InRlc3RhZG1pbkB0ZXN0LnRlcyIsInNjb3BlcyI6WyJpZGVudGl0eS5iYXNpYyIsImlkZW50aXR5LmVtYWlsIiwiYWRtaW4iXSwiY29kZSI6ImFiY2QtNjY2In1d'

    before(() => {
      seedUsers(data)
    })

    after(resetStubs)

    it('created two users', () => {
      expect(mockStore.usersById.set).to.have.been.called
      expect(mockStore.usersByToken.set).to.have.been.calledTwice
      expect(mockStore.tokensByCode.set).to.have.been.calledTwice
    })

    it("didn't log an error or reset the caches", () => {
      expect(mockLogger.error).not.to.have.been.called
      expect(mockStore.usersById.reset).not.to.have.been.called
      expect(mockStore.usersByToken.reset).not.to.have.been.called
      expect(mockStore.tokensByCode.reset).not.to.have.been.called
    })
  })

  context('sad', () => {
    const data = "that's no' how you make porridge"

    before(() => {
      seedUsers(data)
    })

    after(resetStubs)

    it('logged an error and reset the caches', () => {
      expect(mockLogger.error).to.have.been.calledOnce
      expect(mockStore.usersById.reset).to.have.been.calledOnce
      expect(mockStore.usersByToken.reset).to.have.been.calledOnce
      expect(mockStore.tokensByCode.reset).to.have.been.calledOnce
    })

    it("didn't create any users", () => {
      expect(mockStore.usersById.set).not.to.have.been.called
      expect(mockStore.usersByToken.set).not.to.have.been.called
      expect(mockStore.tokensByCode.set).not.to.have.been.called
    })
  })

  context('indifferent', () => {
    before(() => {
      seedUsers()
    })

    after(resetStubs)

    it('returns without doing anything', () => {
      expect(mockLogger.error).not.to.have.been.called
      expect(mockStore.usersById.set).not.to.have.been.called
      expect(mockStore.usersByToken.set).not.to.have.been.called
      expect(mockStore.tokensByCode.set).not.to.have.been.called
      expect(mockStore.usersById.reset).not.to.have.been.called
      expect(mockStore.usersByToken.reset).not.to.have.been.called
      expect(mockStore.tokensByCode.reset).not.to.have.been.called
    })
  })
})
