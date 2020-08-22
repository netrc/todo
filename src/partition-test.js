const pa = require('./partition')

const ar = [ 1,3,5,6,8,10,14 ]

const evens = n => (n%2==0)
const paByEvens = pa.partitionArrayBy(evens)

const [ arEvens, arOdds ]  = paByEvens(ar)
console.log(arEvens)
console.log(arOdds)

console.log('----------')

const hundreds = n => (n>99)
const paByHundreds = pa.partitionArrayBy(hundreds)

const [ arHundreds, arLess ]  = paByHundreds(ar)
console.log(arHundreds)
console.log(arLess)


