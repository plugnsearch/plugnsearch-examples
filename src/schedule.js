const path = require('path')
const cron = require('node-cron')
const exec = require('child_process').exec

const BABEL_NODE = path.join(__dirname, '../node_modules/.bin/babel-node')
const MAIL_TO = 'georg@get83.de'
const MAIL_FROM = 'cron-error@get83.de'

cron.schedule('56 23 * * *', function () {
  const script = 'src/hackernews.js'
  const dockerCmd = `docker run --rm -v "$(pwd)/results:/results" -v "$(pwd)/logs:/logs" plugnsearch-example:latest yarn start ${script}`
  exec(dockerCmd, (err, stdout, stderr) => {
    if (err) {
      exec(`echo "subject: Error in node cron schedule (running ${script})
${err}" | sendmail -r ${MAIL_FROM} ${MAIL_TO}`)
    }
    if (stderr) {
    }
  })
})
