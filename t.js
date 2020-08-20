#!/usr/bin/node

const fs = require('fs')
const td = require('./src/tdates')
const ddb = require('./src/ddb')

const putFileItem = async ( fname, itemKey ) => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await ddb.putItem( fVal, itemKey)
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
      val = await ddb.getItem('todo')
      console.log(val)
    }
    if (av[3]=='-f') {
      const fname = av[4]
      putFileItem(fname, 'todo')
    }
    return
  }

  const doneKey = td.isoToDayStr(td.isoStr())
  val = await ddb.getItem(doneKey)
  const newDone = process.argv.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    console.log(val)
  } else { 
    const timeStr = td.isoToTimeStr(td.isoStr())
    const newValStr = `${val}\n${timeStr}: ${newDone}`
    //console.log(`putting... ${newValStr}`)
    await ddb.putItem(newValStr, doneKey)
  }
}

main()
