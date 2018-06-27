/* eslint-disable camelcase */
const { ping, versions } = require('src/api')

module.exports = {
  get: {
    '/': versions,
    '/ping': ping
  },
  post: {}
}
