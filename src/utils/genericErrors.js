const logger = require('src/utils/logger')
const ERRORS = require('src/errors')

const genericErrors = (err, req, res, next) => {
  if (res.headersSent) return next(err)
  const { path } = req
  const { status = 500 } = err

  logger.error(ERRORS.GENERIC_ERROR(path), err)
  res.status(status).json({ error: err.message })
}

module.exports = genericErrors
