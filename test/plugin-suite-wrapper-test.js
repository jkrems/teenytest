var helper = require('./support/helper')
var assert = require('assert')

module.exports = function (cb) {
  require('../index').plugins.register({
    name: 'woah the suite will fail',
    supervisors: {
      suite: function (runSuite, metadata, cb) {
        runSuite(function (er) {
          cb(new Error('lol'))
        })
      }
    }
  })
  helper.run('test/fixtures/basic-test-passing-obj*.js', function (er, result, log) {
    assert.equal(result, false)
    log.assert(
      'TAP version 13',
      '1..2',
      'ok 1 - "bar" - test #1 in `test/fixtures/basic-test-passing-object.js`',
      'ok 2 - "baz" - test #2 in `test/fixtures/basic-test-passing-object.js`',
      / An error occurred in suite: /,
      '  ---',
      '  message: lol',
      /stacktrace: Error: lol/,
      '  ...',
      ' An error occurred in suite: "global" in `test/fixtures/basic-test-passing-obj*.js`',
      '  ---',
      '  message: lol',
      /stacktrace: Error: lol/,
      '  ...'
    )
    cb(er)
  })
}

