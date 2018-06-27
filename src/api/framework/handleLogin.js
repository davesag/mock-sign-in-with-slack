const HttpError = require('node-http-error')
const { v4 } = require('uuid')
const url = require('url')
const ERRORS = require('src/errors')

const { CLIENT_ID, REDIRECT_URI } = require('src/utils/config')
const makeUser = require('src/helpers/makeUser')
const { usersById, usersByToken, tokensByCode } = require('src/utils/store')

const handleLogin = (req, res) => {
  console.log(req.body)
  const {
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
    name,
    email,
    isAdmin
  } = req.body
  if (clientId && clientId !== CLIENT_ID)
    throw new HttpError(400, ERRORS.INVALID_CLIENT_ID)
  if (!REDIRECT_URI && !redirectUri)
    throw new HttpError(400, ERRORS.MISSING_REDIRECT_URI)
  if (REDIRECT_URI && redirectUri && REDIRECT_URI !== redirectUri)
    throw new HttpError(400, ERRORS.INVALID_REDIRECT_URI)

  const redirectTo = redirectUri || REDIRECT_URI
  const scopes = scope.split(',')

  const user = makeUser({ scopes, name, email })
  const code = v4()
  const token = v4()
  usersById.set(user.id, user)
  usersByToken.set(token, user)
  tokensByCode.set(code, token)

  res.redirect(`${redirectTo}?code=${code}`)
}

module.exports = handleLogin
