
// see https://stackoverflow.com/questions/38860643/split-array-into-two-different-arrays-using-functional-javascript

// g is a collection appender function
// f is the partition function returning true/false
// xs is the collection
// returns spread of results; each could be undefined
exports.partitionCollectionBy = g => f => xs => {
  const a = xs.reduce( (m, x) => {
    const v = f(x)
    return m.set(v, g(m.get(v), x))
  }, new Map())
  return [ a.get(true), a.get(false) ]
}

const arrayAppendFunc = (a=[], b) => [ ...a, b ]
exports.partitionArrayBy = exports.partitionCollectionBy( arrayAppendFunc )

