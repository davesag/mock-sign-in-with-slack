const HttpError = require('node-http-error')
const ERRORS = require('src/errors')
const { usersByToken } = require('src/utils/store')

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
