
exports.isoToDayStr = s => s.substring(0,10)  // '2020-08-19'
exports.isoToTimeStr = s => s.substring(11,16)  // '21:04      // WRONG TIME ZONE

const padz = n => n.toString().padStart(2,'0')

exports.isoStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${padz(d.getMonth()+1)}-${padz(d.getDate())}T${padz(d.getHours())}:${padz(d.getMinutes())}:${padz(d.getSeconds())}`
}
