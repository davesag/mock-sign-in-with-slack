const { expect } = require('chai')

const Cache = require('src/utils/Cache')

describe('src/utils/Cache', () => {
  let cache
  let result

  const key = 'key'
  const value = 'value'

  describe('set and get', () => {
    before(() => {
      cache = new Cache()
      cache.set(key, value)
      result = cache.get(key)
    })

    it('returns the right value', () => {
      expect(result).to.equal(value)
    })
  })

  describe('clear', () => {
    before(() => {
      cache = new Cache()
      cache.set(key, value)
      cache.clear(key)
      result = cache.get(key)
    })

    it('clears the given key from the cache', () => {
      expect(result).to.be.undefined
    })
  })
})
