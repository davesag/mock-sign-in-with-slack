const HttpError = require('node-http-error')
const { v4 } = require('uuid')
const ERRORS = require('src/errors')

const { CLIENT_ID, REDIRECT_URI } = require('src/utils/config')
const makeUser = require('src/helpers/makeUser')
const { usersById, usersByToken, tokensByCode } = require('src/utils/store')

const handleLogin = (req, res) => {
  const {
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    // state,
    name,
    email
  } = req.body
  if (!clientId) throw new HttpError(400, ERRORS.MISSING_CLIENT_ID)
  if (clientId !== CLIENT_ID) throw new HttpError(400, ERRORS.INVALID_CLIENT_ID)
  /* istanbul ignore next */
  if (!REDIRECT_URI && !redirectUri) throw new HttpError(400, ERRORS.MISSING_REDIRECT_URI)
  if (REDIRECT_URI && redirectUri && REDIRECT_URI !== redirectUri)
    throw new HttpError(400, ERRORS.INVALID_REDIRECT_URI)

  const scopes = scope.split(',')
  if (!scopes.includes('identity.basic')) throw new HttpError(400, ERRORS.INVALID_SCOPE)

  const redirectTo = redirectUri || /* istanbul ignore next */ REDIRECT_URI

  const user = makeUser({ scopes, name, email })
  const code = v4()
  const token = v4()
  usersById.set(user.id, user)
  usersByToken.set(token, user)
  tokensByCode.set(code, token)
  // add state
  res.redirect(`${redirectTo}?code=${code}`)
}

module.exports = handleLogin
