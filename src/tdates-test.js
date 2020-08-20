

var td = require('./tdates')

const isoStr = td.isoStr()
const dayStr = td.isoToDayStr(td.isoStr())
const timeStr = td.isoToTimeStr(td.isoStr())

console.log(`isoStr: ${isoStr}`)
console.log(`dayStr: ${dayStr}`)
console.log(`timeStr: ${timeStr}`)

