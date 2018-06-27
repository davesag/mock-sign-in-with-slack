const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('appMaker', () => {
  const fakeErrorHandler = sinon.spy()
  const fakeCors = 'cors'
  const mockCors = sinon.stub().returns(fakeCors)
  const mockUse = sinon.spy()
  const mockSet = sinon.spy()
  const mockRest = sinon.spy()

  const fakeExpress = () => ({
    use: mockUse,
    set: mockSet
  })

  const resetStubs = () => {
    mockCors.resetHistory()
    mockUse.resetHistory()
    mockRest.resetHistory()
    mockSet.resetHistory()
    fakeErrorHandler.resetHistory()
  }

  const makeApp = proxyquire('src/utils/appMaker', {
    express: fakeExpress,
    cors: mockCors,
    'src/utils/rest': mockRest,
    'src/utils/genericErrors': fakeErrorHandler
  })

  let app

  before(() => {
    app = makeApp()
  })

  after(resetStubs)

  it('uses cors', () => {
    expect(mockCors).to.have.been.calledOnce
    expect(mockUse).to.have.been.calledWith(fakeCors)
  })

  it('set pug as the view renderer', () => {
    expect(mockSet).to.have.been.calledWith('view engine', 'pug')
  })

  it('set the views folder', () => {
    expect(mockSet).to.have.been.calledWith('views', './src/views')
  })

  it('invokes rest with app', () => {
    expect(mockRest).to.have.been.calledWith(app)
  })

  it('uses the genericError handler', () => {
    expect(mockUse).to.have.been.calledWith(fakeErrorHandler)
  })
})
