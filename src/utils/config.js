const env = process.env.NODE_ENV || /* istanbul ignore next */ 'development'
const CLIENT_ID = process.env.CLIENT_ID || 'testing'
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'testing'
const PORT = process.env.PORT || 9000

module.exports = { env, CLIENT_ID, CLIENT_SECRET, PORT }
