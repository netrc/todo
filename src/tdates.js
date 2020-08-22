
exports.isoToDayStr = s => s.substring(0, 10) // '2020-08-19'
exports.isoToTimeStr = s => s.substring(11, 16) // '21:04'

const padz = n => n.toString().padStart(2, '0')

exports.isoStr = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = padz(d.getMonth() + 1)
  const day = padz(d.getDate())
  const hours = padz(d.getHours())
  const mins = padz(d.getMinutes())
  const secs = padz(d.getSeconds())
  return `${year}-${month}-${day}T${hours}:${mins}:${secs}`
}
