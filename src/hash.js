

const c = require('crypto')

// for full list of digest/hash functions check your platform with
// $ openssl list -digest-algorithms


exports.get = s => {
  const h = c.createHash('sha256') // 'md5'...
  h.update(s)
  return h.digest('base64') // buffer encoding:  hex base64
}
