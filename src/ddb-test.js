#!/usr/bin/node

// Auth:  uses AWS env vars for auth
require('./envChecks.js').exitIfMissing( [ 'AWS_SECRET_ACCESS_KEY', 'AWS_ACCESS_KEY_ID' ] )

const ddb = require('./ddb')

ddb.checkEnv()

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

