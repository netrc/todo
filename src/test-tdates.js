
var test = require('ava')

var td = require('./tdates')

test('day str', t => {
  const isoStr = "2020-08-22T12:31:45Z+5"
  const dayStr = td.isoToDayStr(isoStr)
  t.is('2020-08-22', dayStr)
 })

test('time str', t => {
  const isoStr = "2020-08-22T12:31:45Z+5"
  const timeStr = td.isoToTimeStr(isoStr)
  t.is('12:31', timeStr)
 })
