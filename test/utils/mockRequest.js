const mockRequest = (options = {}) => ({
  body: {},
  query: {},
  params: {},
  headers: {},
  ...options
})

module.exports = mockRequest
