#!/usr/bin/node

const ddb = require('./ddb')

ddb.checkEnv() // Auth:  uses AWS env vars for auth

const hr = '------------------------\n'
const main = async () => {
  val = await ddb.getItem('todo')
  console.log(hr, val)

  const doneKey = '2020-08-20'
  val = await ddb.getItem(doneKey)
  console.log(hr, val)

    // addDoneItemList( [ newDone ], val, doneKey )
}

ddb.setTable('todo')
main()

