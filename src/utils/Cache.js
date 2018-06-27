class Cache {
  constructor() {
    this.database = {}
  }

  get(key) {
    return this.database[key]
  }

  set(key, value) {
    this.database[key] = value
  }

  clear(key) {
    delete this.database[key]
  }
}

module.exports = Cache
