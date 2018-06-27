const uptime = require('src/utils/uptime')
const { name, version, description } = require('package.json')

const ping = (req, res) => {
  res.json({
    name,
    description,
    version,
    uptime: uptime()
  })
}

module.exports = ping
