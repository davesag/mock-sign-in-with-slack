const sinon = require('sinon')

const mockUuid = {
  v4: sinon.stub(),
  '@noCallThru': true
}

module.exports = mockUuid
