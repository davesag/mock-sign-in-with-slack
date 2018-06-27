let theServer

const put = server => {
  theServer = server
}

const get = () => theServer

module.exports = { put, get }
