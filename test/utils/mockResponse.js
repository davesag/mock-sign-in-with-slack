const { spy, stub } = require('sinon')

const mockResponse = (options = {}) => {
  const res = {
    json: spy(),
    send: spy(),
    end: spy(),
    render: spy(),
    redirect: spy(),
    ...options
  }
  res.status = stub().returns(res)
  return res
}

module.exports = mockResponse
