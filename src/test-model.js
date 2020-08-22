
const test = require('ava')

const [ Model, Todo, Journal ] = require('./model').models()

const j20200819 = `nothing yet
23:36: ...something more...
23:43: /home/ric/lsrc/ddb/to1.js
23:43: 
23:43: trying to add some text
[07:48] trying to add to 2020-08-19`
  

test('gets aug 19 journal', async t => {
  Model.checkEnv()
  
  //val = await Todo.get()
  //console.log(`todo...\n`,val)

  val = await Journal.get('2020-08-19')
  t.is(val, j20200819)  
})




//  if (av.length>=3 && av[2]=="-t") { // todo stuff
//    if (av.length==3) {  // no more args, just show
//      val = await ddb.getItem('todo')
//  val = await model.todoGet()
//      console.log(val)
//    }
//    if (av[3]=='-f') {
//      const fname = av[4]
//      putFileItem(fname, 'todo')
//await model.todoPutFile(fname)
//    }
//    if (av[3]=='-e') {
//      const editor = ('EDITOR' in process.env) ? process.env.EDITOR : 'vi'
//      const f = tmp.fileSync() //; console.log(`using ${f.name}`) // doesn't auto-delete at exit 
//      val = await ddb.getItem('todo')
//val = await model.todoGet()
//      fs.writeFileSync(f.name,val)
//      cp.spawnSync(editor, [f.name], {stdio: 'inherit'})
//      const fVal = fs.readFileSync( f.name, 'utf8' )
//      f.removeCallback()  // alas, seems like we need to do it manually
//
//      const [ dones, todos ] = partitionByDONE( fVal.split('\n') ) //; console.dir(dones)
//      if (todos) { // though will always be defined
//        ddb.putItem(todos.join('\n'), 'todo') // the not DONEs
//val = await model.todoPut( todos.join('\n') )
//      }
//      if (dones) { // maybe undefined cuz we didn't DONE anything
//        const doneKey = td.isoToDayStr(td.isoStr())
//        val = await ddb.getItem(doneKey)
//        addDoneItemList( dones, val, doneKey )
//await model.addDoneItemList (dones, doneKey)
//      }
//    }
//    return
//  }
//
//  // done stuff
//  let doneKey = td.isoToDayStr(td.isoStr())
//  if (av.length>=3 && av[2]=='-d') {
//    doneKey = av[3]
//    av.splice(2,2)
//  }
//  val = await ddb.getItem(doneKey)
//val = await model.journalGet(doneKey)
//  const newDone = av.slice(2).join(' ')
//  if (newDone == '') { // empty? just print current value
//    console.log(val)
//  } else { 
//    addDoneItemList( [ newDone ], val, doneKey )
//  }
//}
