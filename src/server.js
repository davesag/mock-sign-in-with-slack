const makeApp = require('src/utils/appMaker')
const { PORT } = require('src/utils/config')
const shutdown = require('src/utils/shutdown')

const start = async () => {
  const app = makeApp()
  const server = await app.listen(PORT)
  const close = shutdown(server)

  return { server, close }
}

module.exports = {
  start
}
