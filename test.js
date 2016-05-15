/* global describe, it */
const BufferHelper = require('bufferhelper')
const assert = require('assert')
const chmodSync = require('child_process').chmodSync
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const fs = require('fs')

// todo: more test cases

execSync('chmod +x ./index.js')
// execSync('alias js="./index.js"') // not work with spawn

describe('jayin', () => {
  it ('x', (done) => {
    const helper = new BufferHelper()
    const js = spawn('./index.js', ['x.slice(2, 4)'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '[3,4]')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4,5]')
  })

  it('-t', (done) => {
    const helper = new BufferHelper()
    const js = spawn('./index.js', ['-t', 'x.slice(1, -1).replace(/,/g, `\n`)'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '1\n2\n3\n4\n5')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4,5]')
  })

  it ('i: x, -e, exec', (done) => {
    // https://www.shell-tips.com/2010/06/14/performing-math-calculation-in-bash/
    // const env = { count: 0 }
    // execSync('count=0')
    const helper = new BufferHelper()
    const js = spawn('./index.js', ['-e', 'exec(`echo "${i}: ${x}" >> tmp`)'])
    js.stdout.once('end', () => {
      // assert.equal(execSync('echo $count').toString(), '15')
      // assert.equal(env.count, '15')
      assert.equal(helper.toString(), '["a","b","c"]') // in chain
      assert.equal(execSync('cat tmp').toString(), '0: a\n1: b\n2: c\n')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('["a","b","c"]')
  })

  after(() => {
    fs.unlinkSync('tmp')
  })
})
