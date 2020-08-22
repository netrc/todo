
// model -> database wrapper

const ddb = require('./ddb')

// model
const Model = {
  checkEnv: ddb.checkEnv // check for AWS auth; or exits
}

// todo
const Todo = {
  get: async () => {
    const val = await ddb.getItem('todo')
    return val
  },
  put: async (s) => {
    await ddb.putItem( s, 'todo')
  },
  putFile: async ( fname ) => {
    const fVal = fs.readFileSync( fname, 'utf8' )
    await ddb.putItem( fVal, 'todo')
  }
}


// journal
const Journal = {
  get: async (key) => {
    const val = await ddb.getItem(key)
    return val
  },
  addDoneItemList: async ( lines, key ) => {
    if (!lines)
      return
    const oldVal = await ddb.getItem(key)
    const timeStr = td.isoToTimeStr(td.isoStr())
    const newLines = lines.map( l => `[${timeStr}] ${l}` )
    const newValStr = [ oldVal, ...newLines ].join('\n')   //; console.log(`putting... ${newValStr}`)
    await ddb.putItem(newValStr, key)
  }
}

exports.models = () => [ Model, Todo, Journal ]


//  if (av.length>=3 && av[2]=="-t") { // todo stuff
//    if (av.length==3) {  // no more args, just show
//      val = await ddb.getItem('todo')
//val = await model.todoGet()
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
// // done stuff
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
