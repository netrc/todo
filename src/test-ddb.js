#!/usr/bin/node

const test = require('ava')

const ddb = require('./ddb')

test('basic ddb test', async t => {
  ddb.checkEnv() // Auth:  uses AWS env vars for auth

  ddb.setTable('todo')

  const tval = await ddb.getItem('todo', 'main')
  t.true(tval.length>50)  

  const doneKey = '2020-08-20'
  const jval = await ddb.getItem('journal', doneKey)
  t.true(jval.length>10)  
})
