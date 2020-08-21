
// see https://stackoverflow.com/questions/38860643/split-array-into-two-different-arrays-using-functional-javascript

// g is a collection appender function
// f is the partition function returning true/false
// xs is the collection
exports.partitionCollectionBy = g => f => xs => {
  return xs.reduce((m,x) => {
    let v = f(x)
    return m.set(v, g(m.get(v), x))
  }, new Map())
}

exports.partitionArrayBy = exports.partitionCollectionBy( (a=[],b) => [...a,b] )

