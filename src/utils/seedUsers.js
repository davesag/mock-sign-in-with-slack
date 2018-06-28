const logger = require('src/utils/logger')
const { usersById, usersByToken, tokensByCode } = require('src/utils/store')
const { v4 } = require('uuid')

const seedUsers = encoded => {
  if (!encoded) return

  try {
    const json = Buffer.from(encoded, 'base64').toString()
    const users = JSON.parse(json)
    users.forEach(({ name, email, scopes, code }) => {
      const id = v4()
      const token = v4()
      const user = { name, email, id, scopes }
      usersById.set(id, user)
      usersByToken.set(token, user)
      tokensByCode.set(code, token)
    })
  } catch (err) {
    logger.error(err)
    usersById.reset()
    usersByToken.reset()
    tokensByCode.reset()
  }
}

module.exports = seedUsers
