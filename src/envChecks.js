
const envExists = e => (e in process.env)
const envNotEmpty = e => (process.env[e] != '')

const envList = [ 'AWS_SECRET_ACCESS_KEY', 'AWS_ACCESS_KEY_ID', 'asdf' ]
exports.exitIfMissing = ( envList ) => {
  if (  ! envList.every(envExists)  || ! envList.every(envNotEmpty) ) {
    console.log(`must set environment variables ${envList.join(', ')}`)
    process.exit(1)
  }
}

