#!/usr/bin/env node

// writen in es5, for better env compatability

// todo: maybe JacksonTian/bufferhelper?
// todo: minimist for friendly cli handling?
// vm: https://nodejs.org/api/vm.html
var through2 = require('through2')
var cp = require('child_process')
var vm = require('vm')
var stdin = process.stdin
var stdout = process.stdout

var args = process.argv.slice(2)
var forEach = false
var textIn = false
var textOut = false
var expr

args.forEach(function (arg) {
  if (arg === '-e') { // for each
    forEach = true
  } else if (arg === '-ti') { // text input
    textIn = true
  } else if (arg === '-to') { // text output
    textOut = true
  } else if (arg === '-t') { // text i/o
    textIn = textOut = true
  } else if (!expr) {
    expr = arg
  }
})

if (forEach) {
  expr = 'x.forEach(function (x, i) {' + expr + '}), x'
}

stdin.pipe(through2(function (chunk, enc, callback) {
  var injson = chunk.toString()

  var inobj = textIn ? injson : JSON.parse(injson)
  var sandbox = {
    exec: cp.execSync,
    x: inobj
  }
  vm.createContext(sandbox)
  var outobj = vm.runInContext(expr, sandbox)

  var outjson = textOut ? outobj : JSON.stringify(outobj)
  this.push(outjson)
})).pipe(stdout)
