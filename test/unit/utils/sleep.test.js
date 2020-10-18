const { expect } = require('chai')

const sleep = require('src/utils/sleep')

describe('src/utils/sleep', () => {
  let sleptFor

  const sleepTime = 100 // milliseconds

  before(async () => {
    const start = new Date().getTime()
    await sleep(sleepTime)
    const end = new Date().getTime()
    sleptFor = end - start
  })

  it('slept', () => {
    expect(sleptFor).to.be.at.least(sleepTime - 1) //  timing is not super accurate
    expect(sleptFor).to.almost.equal(sleepTime)
  })
})
