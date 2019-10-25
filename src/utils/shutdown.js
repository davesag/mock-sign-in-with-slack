const logger = require('src/utils/logger')

const shutdown = server => () => {
  server.close(
    /* istanbul ignore next */
    err => {
      if (err) {
        logger.error(err)
        process.exit(1)
      }

      process.exit()
    }
  )
}

module.exports = shutdown
