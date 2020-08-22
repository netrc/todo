
var test = require('ava')

var h = require('./hash.js')

test('evens str', t => {
  const a = 'some random string'
  t.is( h.get(a), 'Q0LgjQHySsRRvDu/9oZAhWO1wm04bQwYh5JE9eeXTX0=')
 })

