const fs = require('fs')
const path = require('path')

const traverse = (base, ignore, processor) => {
  const isJsFile = file =>
    !file.startsWith('.') && !file.endsWith(ignore) && file.slice(-3) === '.js'

  const traversePath = folder => {
    const findFile = file => {
      const folderOrFile = path.join(folder, file)
      try {
        traversePath(folderOrFile)
      } catch (err) {
        /* istanbul ignore if */
        if (
          err.code !== 'ENOTDIR' &&
          /* istanbul ignore next */ err.code !== 'EBUSY'
        )
          throw err
        if (isJsFile(folderOrFile)) processor(folderOrFile)
      }
    }

    fs.readdirSync(folder).forEach(findFile)
  }

  traversePath(base)
}

module.exports = traverse
