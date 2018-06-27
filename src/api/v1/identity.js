const HttpError = require('node-http-error')
const { CLIENT_ID, CLIENT_SECRET, TEAM_ID } = require('src/utils/config')
const ERRORS = require('src/errors')
const { tokensByCode, usersByToken } = require('src/utils/store')
const decodeBasic = require('src/helpers/decodeBasic')

const identity = (req, res) => {
  const { token } = req.query
  if (!token) throw new HttpError(401, ERRORS.MISSING_TOKEN)

  try {
    const { scopes, ...user } = usersByToken.get(token)

    res.json({
      ok: true,
      user
    })
  } catch (err) {
    throw new HttpError(404, ERRORS.INVALID_TOKEN)
  }
}

module.exports = identity
