/* eslint-disable dot-notation */
const decodeBasic = req => {
  const auth = req.headers['authorization']
  if (!auth) return {}
  const tmp = auth.split(' ')
  const buf = Buffer.from(tmp[1], 'base64')
  const plain = buf.toString()
  const [clientId, clientSecret] = plain.split(':')
  return { clientId, clientSecret }
}

module.exports = decodeBasic
