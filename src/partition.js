

exports.partitionCollectionBy = g => f => xs => {
  return xs.reduce((m,x) => {
    let v = f(x)
    return m.set(v, g(m.get(v), x))
  }, new Map())
}

exports.partitionArrayBy = exports.partitionCollectionBy( (a=[],b) => [...a,b] )

