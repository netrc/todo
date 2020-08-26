
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
  _type: 'todo', // ddb primary key
  _defaultKey: 'main'
}
Todo.get = async (tname=Todo._defaultKey) => {
  const val = await ddb.getItem(Todo._type, tname)
  return val
}
Todo.put = async (s, tname=Todo._defaultKey) => {
  await ddb.putItem( s, Todo._type, tname)
}
Todo.putFile = async fname => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await Todo.put(fVal)
}


// journal model
const Journal = {
  _type: 'journal' // ddb primary key // no default sk1
}
Journal.get = async key => {
  const val = await ddb.getItem(Journal._type, key) // will use _type, key soon
  return val
}
Journal.put = async (s, jname) => {
  await ddb.putItem( s, Journal._type, jname)
}
Journal.addDoneItemList = async ( lines, key ) => {
  if (!lines) {
    return
  }
  const oldVal = await Journal.get(key)
  const timeStr = td.isoToTimeStr(td.isoStr())
  const newLines = lines.map( l => `[${timeStr}] ${l}` )
  const newValStr = [ oldVal, ...newLines ].join('\n')
  await Journal.put(newValStr, key)
}


exports.models = () => [ Model, Todo, Journal ]
