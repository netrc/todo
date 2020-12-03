
module.exports = {
  entry: './t.js',
  output: {
    filename: 'tpack.js'
  },
  target: 'node',
  resolve: {
    fallback: { 
      "process": false,
      "util" : false,
      "path" : false,
      "crypto" : false,
      "os" : false,
      "assert" : false,
      "util" : false,
      "fs" : false,
      "child_process" : false
    }
  }
}
