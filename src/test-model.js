
const test = require('ava')

const [ Model, Todo, Journal ] = require('./model').models()

const j20200819 = `nothing yet
23:36: ...something more...
23:43: /home/ric/lsrc/ddb/to1.js
23:43:
23:43: trying to add some text
[07:48] trying to add to 2020-08-19`


test('gets aug 19 journal', async t => {
  Model.checkEnv()

  const tval = await Todo.get()
  // console.log(`todo...\n`,val.substr(0,60))
  t.true(tval.length>50)
  t.is(tval.substring(0, 6), '# Todo')

  const jval = await Journal.get('2020-08-19')
  t.is(jval, j20200819)
})
