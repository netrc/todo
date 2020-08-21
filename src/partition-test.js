
const ar = [ 1,3,5,6,8,10,14 ]

const evens = n => (n%2==0)

const paByEvens = require('./partition').partitionArrayBy(evens)

const arEvens = paByEvens(ar)
console.log(arEvens.get(true))
console.log(arEvens.get(false))

