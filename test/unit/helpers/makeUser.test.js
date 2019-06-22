const { expect } = require('chai')
const proxyquire = require('proxyquire')

const mockUuid = require('test/utils/mockUuid')

describe('src/helpers/makeUser', () => {
  const makeUser = proxyquire('src/helpers/makeUser', {
    uuid: mockUuid
  })

  const name = 'name'
  const email = 'some@email.tes'
  const id = 'some-excellent-uuid'

  let result

  before(() => {
    mockUuid.v4.returns(id)
  })

  const resetStubs = () => {
    mockUuid.v4.resetHistory()
  }

  context('when scopes includes identity.email', () => {
    const scopes = ['identity.basic', 'identity.email']

    before(() => {
      result = makeUser({ scopes, name, email })
    })

    after(resetStubs)

    it('created the user correctly', () => {
      expect(result).to.have.property('name', name)
      expect(result).to.have.property('email', email)
      expect(result).to.have.property('scopes', scopes)
      expect(result).to.have.property('id', id)
    })
  })

  context('when scopes does not include identity.email', () => {
    const scopes = ['identity.basic']

    before(() => {
      result = makeUser({ scopes, name, email })
    })

    it('created the user correctly', () => {
      expect(result).to.have.property('name', name)
      expect(result).to.have.property('scopes', scopes)
      expect(result).to.have.property('id', id)
    })
  })
})
