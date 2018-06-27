const routes = require('src/routes')

const METHODS = ['get', 'post', 'patch', 'put', 'delete']

const rest = app => {
  const mapRoute = method => {
    const register = route => {
      app[method](route, routes[method][route])
    }

    if (routes[method]) Object.keys(routes[method]).forEach(register)
  }

  METHODS.forEach(mapRoute)
}

module.exports = rest
