const HttpError = require('node-http-error')
const { CLIENT_ID, REDIRECT_URI } = require('src/utils/config')

const showCode = (req, res) => {
  const { code } = req.query

  res.render('showCode', { code })
}

module.exports = showCode
