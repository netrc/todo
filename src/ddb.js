
const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1'
})
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})


const table = 'todo'


// get and return 'done' string for given day
exports.getItem = async ( key  ) => {
  const params = {
      TableName: table,
      Key:{
          pk1: key
      }
  }

  const data = await ddb.get(params).promise().catch( err => {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
      return ""
  })
  // console.log("GetItem succeeded:", JSON.stringify(data, null, 2))
  // call succeeded - but may not exist
  return ('Item' in data) ? data.Item.val : ""
}

exports.putItem = async ( newVal, key ) => {
  const params = {
    TableName: table,
    Item: {
      pk1: key,
      val: newVal
    }
  }

  await ddb.put(params).promise().catch( err => {
      console.error("Unable to put item. Error JSON:", JSON.stringify(err, null, 2))
  })
  //console.log("putItem succeeded:", JSON.stringify(data, null, 2))   // this shouldn't work; data ??
}
