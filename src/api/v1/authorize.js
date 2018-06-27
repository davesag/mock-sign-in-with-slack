const HttpError = require('node-http-error')
const { CLIENT_ID, REDIRECT_URI } = require('src/utils/config')
const ERRORS = require('src/errors')

const authorize = (req, res) => {
  const { client_id: clientId, scope, redirect_uri: redirectUri } = req.query
  if (!clientId) throw new HttpError(400, ERRORS.MISSING_CLIENT_ID)
  if (clientId !== CLIENT_ID) throw new HttpError(400, ERRORS.INVALID_CLIENT_ID)
  /* istanbul ignore next */
  if (!REDIRECT_URI && !redirectUri)
    throw new HttpError(400, ERRORS.MISSING_REDIRECT_URI)
  if (REDIRECT_URI && redirectUri && REDIRECT_URI !== redirectUri)
    throw new HttpError(400, ERRORS.INVALID_REDIRECT_URI)

  const scopes = scope.split(',')
  if (!scopes.includes('identity.basic'))
    throw new HttpError(400, ERRORS.INVALID_SCOPE)
  res.render('loginForm', { query: req.query })
}

module.exports = authorize
