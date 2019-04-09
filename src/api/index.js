const path = require('path')
const traverse = require('traverse-folders')

const pathSeparator = new RegExp(path.sep, 'g')

const apis = {}
const base = __dirname

const processor = file => {
  const name = file.slice(base.length + 1, -3).replace(pathSeparator, '_')
  apis[name] = require(file)
}

traverse(base, processor)

module.exports = apis
