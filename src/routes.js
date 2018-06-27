/* eslint-disable camelcase */
const {
  ping,
  versions,
  v1_authorize,
  framework_handleLogin,
  framework_showCode,
  v1_tokenForCode,
  v1_identity,
  v1_revoke
} = require('src/api')

module.exports = {
  get: {
    '/': versions,
    '/ping': ping,
    '/oauth/authorize': v1_authorize,
    '/show-code': framework_showCode,
    '/api/oauth.access': v1_tokenForCode,
    '/api/users.identity': v1_identity
  },
  post: {
    '/login': framework_handleLogin,
    '/api/auth.revoke': v1_revoke
  }
}
