/* global describe, it, after */
'use strict'
const BufferHelper = require('bufferhelper')
const assert = require('assert')
const cp = require('child_process')
const fs = require('fs')

console.log('process.platform', process.platform)
let nodeCmd = 'node'
if (process.platform === 'win32') {
  nodeCmd = require('which').sync('node')
}
console.log('nodeCmd', nodeCmd)

// todo: more test cases

describe('jayin', () => {
  it ('x', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', 'x.slice(2, 4)'])
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
    const js = cp.spawn(nodeCmd, ['./index.js', '-t', 'x.slice(1, -1).replace(/,/g, `\n`)'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '1\n2\n3\n4\n5')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4,5]')
  })

  it('-ti', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', '-ti', 'a=JSON.parse(x), a.push(999), a'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '[1,2,3,4,5,999]')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4,5]')
  })

  it('-to', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', '-to', 'x.join(`\n`)'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '1\n2\n3\n4\n5')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4,5]')
  })

  it('exprs', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', 'x.filter(x => x % 2)', 'x.reverse()'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '[3,1]')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4]')
  })

  it('no expr', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '[1,2,3,4]')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4]')
  })

  it('_, _.filter, _.reverse', (done) => {
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', '_(x).filter(x => x % 2).reverse().value()'])
    js.stdout.once('end', () => {
      assert.equal(helper.toString(), '[3,1]')
      done()
    })
    js.stdout.on('data', (chunk) => {
      helper.concat(chunk)
    })
    js.stdin.end('[1,2,3,4]')
  })

  it ('i: x, -e, -c', (done) => {
    // https://www.shell-tips.com/2010/06/14/performing-math-calculation-in-bash/
    // const env = { count: 0 }
    // execSync('count=0')
    const helper = new BufferHelper()
    const js = cp.spawn(nodeCmd, ['./index.js', '-e', '-c', "(echo ${i}: ${x}) >> tmp"])
    js.stdout.once('end', () => {
      // assert.equal(execSync('echo $count').toString(), '15')
      // assert.equal(env.count, '15')
      assert.equal(helper.toString(), '["a","b","c"]') // in chain
      assert.equal(cp.execSync('cat tmp').toString().replace(/\r\n/g, '\n'), '0: a\n1: b\n2: c\n')
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
