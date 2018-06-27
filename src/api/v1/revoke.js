const HttpError = require('node-http-error')
const ERRORS = require('src/errors')
const { usersByToken } = require('src/utils/store')

const revoke = (req, res) => {
  const { token } = req.query
  if (!token) throw new HttpError(401, ERRORS.MISSING_TOKEN)

  usersByToken.clear(token)

  res.json({
    ok: true,
    revoked: true
  })
}

module.exports = revoke
