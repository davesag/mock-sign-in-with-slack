const Cache = require('src/utils/Cache')

const usersById = new Cache()
const usersByToken = new Cache()
const tokensByCode = new Cache()

module.exports = {
  usersById,
  usersByToken,
  tokensByCode
}
