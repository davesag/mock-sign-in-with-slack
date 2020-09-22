require('dotenv').config()
const Server = require('src/server')
const logger = require('src/utils/logger')
const { SEED_USERS } = require('src/utils/config')
const seedUsers = require('src/utils/seedUsers')

process.on('unhandledRejection', (reason, p) => {
  if (reason.code && reason.code === 'ECONNREFUSED') {
    logger.debug('Known issue in the pg library wherin it fails to catch ECONNREFUSED')
  } else {
    logger.error('Unhandled rejection in promise', p, 'caused by', reason)
  }
})

Server.start().then(({ close }) => {
  logger.debug('Server Started')
  if (!SEED_USERS) {
    logger.debug('No users to seed')
  } else {
    seedUsers(SEED_USERS)
    logger.debug('Seeded users')
  }

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Closing server.')
    close()
  })
})
