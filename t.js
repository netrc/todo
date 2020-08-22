#!/usr/bin/node

const fs = require('fs')
const cp = require('child_process')
const tmp = require('tmp')
const td = require('./src/tdates')
const ddb = require('./src/ddb')
const pa = require('./src/partition')

ddb.checkEnv() // check for AWS auth; or exits

const doneFilter = l => l.substring(0,4)=="DONE"
const partitionByDONE = pa.partitionArrayBy(doneFilter)

const putFileItem = async ( fname, itemKey ) => {
  const fVal = fs.readFileSync( fname, 'utf8' )
  await ddb.putItem( fVal, itemKey)
}

const addDoneItemList = async ( lines, oldVal, key ) => {
    if (!lines)
      return
    const timeStr = td.isoToTimeStr(td.isoStr())
    const newLines = lines.map( l => `[${timeStr}] ${l}` )
    const newValStr = [ oldVal, ...newLines ].join('\n')   //; console.log(`putting... ${newValStr}`)
    await ddb.putItem(newValStr, key)
}

const main = async () => {
  const av = process.argv

  if (av.length==3 && (av[2]=="-h" || av[2]=="-?" || av[2]=="--help")) { 
    const p = av[1]
    console.log(`${p} - todo/journal editor
      ${p} -t                             print todo to stdout
      ${p} -t -e                          open editor on todo; replace todo; put "DONE " lines into journal
      ${p} -t -f <file>                   replace file contents into todo and DONE to journal
      ${p} [-d yyyy-mm-dd] <no args>      show today's (or date) journal
      ${p} [-d yyyy-mm-dd] some text      add some text w/ timestamp to today's (or date) journal
    `)
    return
  }

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
      const f = tmp.fileSync() //; console.log(`using ${f.name}`) // doesn't auto-delete at exit 
      val = await ddb.getItem('todo')
      fs.writeFileSync(f.name,val)
      cp.spawnSync(editor, [f.name], {stdio: 'inherit'})
      const fVal = fs.readFileSync( f.name, 'utf8' )
      f.removeCallback()  // alas, seems like we need to do it manually

      const [ dones, todos ] = partitionByDONE( fVal.split('\n') ) //; console.dir(dones)
      if (todos) { // though will always be defined
        ddb.putItem(todos.join('\n'), 'todo') // the not DONEs
      }
      if (dones) { // maybe undefined cuz we didn't DONE anything
        const doneKey = td.isoToDayStr(td.isoStr())
        val = await ddb.getItem(doneKey)
        addDoneItemList( dones, val, doneKey )
      }
    }
    return
  }

  // done stuff
  let doneKey = td.isoToDayStr(td.isoStr())
  if (av.length>=3 && av[2]=='-d') {
    doneKey = av[3]
    av.splice(2,2)
  }
  val = await ddb.getItem(doneKey)
  const newDone = av.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    console.log(val)
  } else { 
    addDoneItemList( [ newDone ], val, doneKey )
  }
}

main()

