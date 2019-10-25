const Server = require('src/server')
const logger = require('src/utils/logger')

// starts the server without seeding users
Server.start().then(() => {
  logger.debug('Server Started')
})
