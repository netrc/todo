const test = require('ava')

const pa = require('./partition')


test('evens str', t => {
  const ar = [ 1, 3, 5, 6, 8, 10, 14 ]
  const evens = n => (n%2==0)
  const paByEvens = pa.partitionArrayBy(evens)
  const [ arEvens, arOdds ] = paByEvens(ar)
  t.deepEqual([ 6, 8, 10, 14 ], arEvens)
  t.deepEqual([ 1, 3, 5 ], arOdds)
})

test('hundreds str', t => {
  const ar = [ 1, 3, 5, 6, 8, 10, 14 ]
  const hundreds = n => (n>99)
  const paByHundreds = pa.partitionArrayBy(hundreds)
  const [ arHundreds, arLess ] = paByHundreds(ar)
  t.deepEqual(undefined, arHundreds)
  t.deepEqual( [ 1, 3, 5, 6, 8, 10, 14 ], arLess)
})
