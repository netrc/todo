#!/usr/bin/node


const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1'
})
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})


const table = 'todo'
const isoToDayStr = s => s.substring(0,10)  // '2020-08-19'
const isoToTimeStr = s => s.substring(11,16)  // '21:04      // WRONG TIME ZONE
const isoStr = () => (new Date()).toISOString()

// get and return 'done' string for given day
const getDone = async ( dayStr=isoToDayStr(isoStr())  ) => {
  const params = {
      TableName: table,
      Key:{
          pk1: dayStr
      }
  }

  data = await ddb.get(params).promise().catch( err => {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
      return ""
  })
  // console.log("GetItem succeeded:", JSON.stringify(data, null, 2))
  // call succeeded - but may not exist
  return ('Item' in data) ? data.Item.val : ""
}

const putDone = async ( newVal, dayStr=isoToDayStr(isoStr()) ) => {
  const params = {
    TableName: table,
    Item: {
      pk1: dayStr,
      val: newVal
    }
  }

  await ddb.put(params).promise().catch( err => {
      console.error("Unable to put item. Error JSON:", JSON.stringify(err, null, 2))
  })
  console.log("putItem succeeded:", JSON.stringify(data, null, 2))
}

// done - show today's done
// done some text  - add timestamp text to today's done
// done -d 2020-08-19  - show that day's done
// done -d 2020-08-19  text  - add timestamp text to that day's done
// done -w  show this week's done
// done -t  - return todo
// done -t <file>  - replace file contents into todo;  put DONE lines into done for today
// done -g a b  - grep 'a b' in todo
const main = async () => {

  val = await getDone()
  const newDone = process.argv.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    console.log(`val: ${val}`)
  } else { 
    const timeStr = isoToTimeStr(isoStr())
    const newValStr = `${val}\n${timeStr}: ${newDone}`
console.log(`putting... ${newValStr}`)
    await putDone(newValStr)
  }
}

main()
