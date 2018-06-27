const { expect } = require('chai')

const traverse = require('src/utils/traverse')

describe('src/utils/traverse', () => {
  const files = []
  const processor = file => {
    files.push(file)
  }
  const expected = [
    'test/unit/fixtures/api/outer.js',
    'test/unit/fixtures/api/test/inner.js'
  ]

  before(() => {
    traverse('test/unit/fixtures/api', 'index.js', processor)
  })

  it('returned the expected files', () => {
    expect(files).to.deep.equal(expected)
  })
})
