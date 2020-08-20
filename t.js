#!/usr/bin/node


const fs = require('fs')
const AWS = require('aws-sdk')
AWS.config.update({
  region: 'us-east-1'
})
const ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})


const table = 'todo'
const td = require('./src/tdates')

// get and return 'done' string for given day
const getDone = async ( key  ) => {
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

const putDone = async ( newVal, key ) => {
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

const putFileItem = async ( fname, itemKey ) => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await putDone( fVal, itemKey)
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
  const av = process.argv

  if (av.length>=3 && av[2]=="-t") { // todo stuff
    if (av.length==3) {  // no more args, just show
      val = await getDone('todo')
      console.log(val)
    }
    if (av[3]=='-f') {
      const fname = av[4]
      putFileItem(fname, 'todo')
    }
    return
  }

  const doneKey = td.isoToDayStr(td.isoStr())
  val = await getDone(doneKey)
  const newDone = process.argv.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    console.log(`val: ${val}`)
  } else { 
    const timeStr = td.isoToTimeStr(td.isoStr())
    const newValStr = `${val}\n${timeStr}: ${newDone}`
console.log(`putting... ${newValStr}`)
    await putDone(newValStr, doneKey)
  }
}

main()
