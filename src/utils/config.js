const env = process.env.NODE_ENV || /* istanbul ignore next */ 'development'

const CLIENT_ID = process.env.CLIENT_ID || 'test-client-id'
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'test-client-secret'
const PORT = process.env.PORT || 8282
const REDIRECT_URI = process.env.REDIRECT_URI || '/show-code'
const SEED_USERS = process.env.SEED_USERS
const TEAM_ID = process.env.TEAM_ID || 'test-team-id'

module.exports = {
  env,
  CLIENT_ID,
  CLIENT_SECRET,
  PORT,
  REDIRECT_URI,
  SEED_USERS,
  TEAM_ID
}
