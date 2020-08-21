#!/usr/bin/node

// Auth:  uses AWS env vars for auth
require('./src/envChecks.js').exitIfMissing( [ 'AWS_SECRET_ACCESS_KEY', 'AWS_ACCESS_KEY_ID' ] )

const fs = require('fs')
const cp = require('child_process')
const tmp = require('tmp')
const td = require('./src/tdates')
const ddb = require('./src/ddb')

const putFileItem = async ( fname, itemKey ) => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await ddb.putItem( fVal, itemKey)
}

const addDoneItemList = async ( lines, oldVal, key ) => {
    const timeStr = td.isoToTimeStr(td.isoStr())
    const newLines = lines.map( l => `[${timeStr}] ${l}` )
    const newValStr = [ oldVal, ...newLines ].join('\n')   //; console.log(`putting... ${newValStr}`)
    await ddb.putItem(newValStr, key)
}

const doneFilter = l => l.substring(0,4)=="DONE"
const notDoneFilter = l => !(doneFilter(l))

// done - show today's done
// done some text  - add timestamp text to today's done
// done -d 2020-08-19  - show that day's done
// done -d 2020-08-19  text  - add timestamp text to that day's done
// done -w  show this week's done
// done -t  - return todo
// done -t -f <file>  - replace file contents into todo;  put DONE lines into done for today
// done -t -e - open editor on todo and replace todo;  put DONE lines into done for oday
// done -t -g a b  - grep 'a b' in todo
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
    if (av[3]=='-e') {
      const editor = ('EDITOR' in process.env) ? process.env.EDITOR : 'vi'
      const f = tmp.fileSync() // and should auto-delete at process exit
      console.log(`using ${f.name}`)
      val = await ddb.getItem('todo')
      fs.writeFileSync(f.name,val)
      cp.spawnSync(editor, [f.name], {
        stdio: 'inherit'
      })

  const fVal = fs.readFileSync( f.name, 'utf8' )
  const doneItems = fVal.split('\n').filter( doneFilter )
  const notDoneItems = fVal.split('\n').filter( notDoneFilter )
  console.log(`doners: ${notDoneItems.join('\n')}`)
      //putFileItem(f.name, 'todo')
  ddb.putItem(notDoneItems.join('\n'), 'todo')
      //f.removeCallback()  // alas, seems like we need to do it manually
  const doneKey = td.isoToDayStr(td.isoStr())
  val = await ddb.getItem(doneKey)
  addDoneItemList( doneItems, val, doneKey )
    }
    return
  }

  // done stuff
  const doneKey = td.isoToDayStr(td.isoStr())
  val = await ddb.getItem(doneKey)
  const newDone = process.argv.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    console.log(val)
  } else { 
    addDoneItemList( [ newDone ], val, doneKey )
  }
}

main()

