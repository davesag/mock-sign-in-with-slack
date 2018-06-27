const express = require('express')
const cors = require('cors')

const rest = require('src/utils/rest')
const genericErrors = require('src/utils/genericErrors')

const makeApp = () => {
  const app = express()
  app.set('view engine', 'pug')
  app.set('views', './src/views')
  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  // add any other middlewares here

  rest(app) // apply the routes

  app.use(genericErrors) // must be last
  return app
}

module.exports = makeApp
