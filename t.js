#!/usr/bin/node

const fs = require('fs')
const process = require('process')
const cp = require('child_process')
const tmp = require('tmp')
const td = require('./src/tdates')
const pa = require('./src/partition')
const [ Model, Todo, Journal ] = require('./src/model').models()

Model.checkEnv() // check for AWS auth; or exits

const doneFilter = l => l.substring(0, 4)=='DONE'
const partitionByDONE = pa.partitionArrayBy(doneFilter)

const main = async () => {
  const av = process.argv

  if (av.length==3 && (av[2]=='-h' || av[2]=='-?' || av[2]=='--help')) {
    const p = av[1]
    console.log(`${p} - todo/journal editor
      ${p} -t                          print todo to stdout
      ${p} -t -e                       edit&replae todo; "DONE " to journal
      ${p} -t -f <file>                put file contents into todo 
      ${p} [-d yyyy-mm-dd] <no args>   show today's (or date) journal
      ${p} [-d yyyy-mm-dd] some text   add text w/ timestamp to journal
    `)
    return
  }

  if (av.length>=3 && av[2]=='-t') { // todo stuff
    if (av.length==3) { // no more args, just show
      const val = await Todo.get()
      console.log(val)
    }
    if (av[3]=='-f') {
      const fname = av[4]
      await Todo.putFile(fname)
    }
    if (av[3]=='-e') {
      const editor = ('EDITOR' in process.env) ? process.env.EDITOR : 'vi'
      const f = tmp.fileSync() // doesn't auto-delete at exit
      const tval = await Todo.get()
      fs.writeFileSync(f.name, tval)
      cp.spawnSync(editor, [ f.name ], {stdio: 'inherit'})
      const fval = fs.readFileSync( f.name, 'utf8' )
      f.removeCallback() // alas, seems like we need to do it manually
      if (tval==fval) {
        console.log('no todo file changes')
        return
      }

      const [ dones, todos ] = partitionByDONE( fval.split('\n') )
      if (todos) { // though will always be defined
        await Todo.put( todos.join('\n') ) // the not DONEs
      }
      if (dones) { // maybe undefined cuz we didn't DONE anything
        const doneKey = td.isoToDayStr(td.isoStr())
        await Journal.addDoneItemList( dones, doneKey )
      }
    }
    return
  }

  // done stuff
  let doneKey = td.isoToDayStr(td.isoStr())
  if (av.length>=3 && av[2]=='-d') {
    doneKey = av[3]
    av.splice(2, 2)
  }
  const newDone = av.slice(2).join(' ')
  if (newDone == '') { // empty? just print current value
    const val = await Journal.get(doneKey)
    console.log(val)
  } else {
    await Journal.addDoneItemList( [ newDone ], doneKey )
  }
}

main()

