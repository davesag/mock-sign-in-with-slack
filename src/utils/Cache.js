class Cache {
  constructor() {
    this.reset()
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

  reset() {
    this.database = {}
  }
}

module.exports = Cache
