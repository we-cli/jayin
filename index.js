#!/usr/bin/env node

// writen in es5, for better env compatability

// todo: maybe JacksonTian/bufferhelper?
// todo: minimist for friendly cli handling?
// vm: https://nodejs.org/api/vm.html
'use strict'
var through2 = require('through2')
var _ = require('lodash')
var cp = require('child_process')
var vm = require('vm')
var stdin = process.stdin
var stdout = process.stdout

var args = process.argv.slice(2)
var forEach = false
var execCmd = false
var textIn = false
var textOut = false
var exprs = []

args.forEach(function (arg) {
  if (arg === '-e') { // for each
    forEach = true
  } else if (arg === '-c') { // exec cmd
    execCmd = true
  } else if (arg === '-ti') { // text input
    textIn = true
  } else if (arg === '-to') { // text output
    textOut = true
  } else if (arg === '-t') { // text i/o
    textIn = textOut = true
  } else {
    exprs.push(arg)
  }
})

var stream = stdin

exprs.forEach(function (expr) {
  if (execCmd) {
    expr = 'exec(`' + expr + '`)'
  }
  if (forEach) {
    expr = 'x.forEach(function (x, i) {' + expr + '}), x'
  }

  stream = stream.pipe(through2(function (chunk, enc, callback) {
    var injson = chunk.toString()

    var inobj = textIn ? injson : JSON.parse(injson)
    var sandbox = {
      exec: cp.execSync,
      _: _,
      x: inobj
    }
    vm.createContext(sandbox)
    var outobj = vm.runInContext(expr, sandbox)

    var outjson = textOut ? outobj : JSON.stringify(outobj)
    this.push(outjson)
  }))
})

stream.pipe(stdout)
