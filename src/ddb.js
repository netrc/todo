
const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1'
})
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})


const envExists = e => (e in process.env)
const envNotEmpty = e => (process.env[e] != '')

const envList = [ 'AWS_SECRET_ACCESS_KEY', 'AWS_ACCESS_KEY_ID' ]
exports.checkEnv = () => {
  if ( ! envList.every(envExists) || ! envList.every(envNotEmpty) ) {
    console.log(`must set env variables for auth: ${envList.join(', ')}`)
    process.exit(1)
  }
}


const conf = {
  table: 'todo'
}

exports.setTable = t => {
  conf.table = t
}

// get and return 'done' string for given day
exports.getItem = async key => {
  const params = {
    TableName: conf.table,
    Key: {
      pk1: key
    }
  }

  const data = await ddb.get(params).promise().catch( err => {
    console.error('read item error:', JSON.stringify(err, null, 2))
    return ''
  })
  // console.log('GetItem succeeded:', JSON.stringify(data, null, 2))
  // call succeeded - but may not exist
  return ('Item' in data) ? data.Item.val : ''
}

exports.putItem = async ( newVal, key ) => {
  const params = {
    TableName: conf.table,
    Item: {
      pk1: key,
      val: newVal
    }
  }

  await ddb.put(params).promise().catch( err => {
    console.error('put item error:', JSON.stringify(err, null, 2))
  })
  // console.log('putItem succeeded:', JSON.stringify(data, null, 2))
}
