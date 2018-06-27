/* eslint-disable camelcase */

const HttpError = require('node-http-error')
const { CLIENT_ID, CLIENT_SECRET, TEAM_ID } = require('src/utils/config')
const ERRORS = require('src/errors')
const { tokensByCode, usersByToken } = require('src/utils/store')
const decodeBasic = require('src/helpers/decodeBasic')

const tokenForCode = (req, res) => {
  const { code, client_id, client_secret } = req.query
  if (!code) throw new HttpError(400, ERRORS.MISSING_CODE)

  const { clientId = client_id, clientSecret = client_secret } = decodeBasic(
    req
  )

  if (clientId !== CLIENT_ID || clientSecret !== CLIENT_SECRET)
    throw new HttpError(401)

  const token = tokensByCode.get(code)
  if (!token) throw new HttpError(404, ERRORS.INVALID_CODE)
  const { scopes } = usersByToken.get(token)

  res.json({
    ok: true,
    access_token: token,
    scope: scopes.join(','),
    team_id: TEAM_ID
  })
}

module.exports = tokenForCode
