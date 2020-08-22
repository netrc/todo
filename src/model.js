
// model -> database wrapper
const fs = require('fs')

const ddb = require('./ddb')
const td = require('./tdates')

// model misc
const Model = {
  checkEnv: ddb.checkEnv // check for AWS auth; or exits
}

// todo model
const Todo = {
  _type: 'todo' // ddb primary key
}
Todo.get = async () => {
  const val = await ddb.getItem(Todo._type)
  return val
}
Todo.put = async s => {
  await ddb.putItem( s, Todo._type)
}
Todo.putFile = async fname => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await Todo.put(fVal)
}


// journal model
const Journal = {
  _type: 'journal' // ddb primary key
}
Journal.get = async key => {
  const val = await ddb.getItem(key) // will use _type, key soon
  return val
}
Journal.addDoneItemList = async ( lines, key ) => {
  if (!lines) {
    return
  }
  const oldVal = await ddb.getItem(key)
  const timeStr = td.isoToTimeStr(td.isoStr())
  const newLines = lines.map( l => `[${timeStr}] ${l}` )
  const newValStr = [ oldVal, ...newLines ].join('\n')
  await ddb.putItem(newValStr, key)
}


exports.models = () => [ Model, Todo, Journal ]
