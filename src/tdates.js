
exports.isoToDayStr = s => s.substring(0,10)  // '2020-08-19'
exports.isoToTimeStr = s => s.substring(11,16)  // '21:04      // WRONG TIME ZONE
exports.isoStr = () => (new Date()).toISOString()

