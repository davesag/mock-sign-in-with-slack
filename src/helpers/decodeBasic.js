const HttpError = require('node-http-error')

const decodeBasic = req => {
  const auth = req.headers['authorization']
  if (!auth) return {}
  const tmp = auth.split(' ')
  const buf = Buffer.from(tmp[1], 'base64')
  const plain_auth = buf.toString()
  const [clientId, clientSecret] = plain_auth.split(':')
  return { clientId, clientSecret }
}

module.exports = decodeBasic
