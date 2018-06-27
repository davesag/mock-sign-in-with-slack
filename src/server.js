const makeApp = require('src/utils/appMaker')
const { PORT } = require('src/utils/config')

const start = async () => {
  const app = makeApp()
  const server = await app.listen(PORT)

  return { server }
}

module.exports = {
  start
}
