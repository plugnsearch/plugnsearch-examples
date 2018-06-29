import fs from 'fs'
import path from 'path'
import winston from 'winston'
import isArray from 'lodash/isArray'

import Crawler, {
  Blacklist,
  ThrottleRequests,
  OnlyDownloadSpecificTypes,
  HttpLinkExpander,
  RobotsTxtAdvisor,
  JSONStreamReporter,
  // ZeroMqReporter,
  // RedisURLQueue
} from 'plugnsearch'
import {
  SelectorExpander
} from 'plugnsearch-apps'

let EXIT_REASON = null

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: '/logs/error.log', level: 'error' })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default (App, seedUrls, config, cb) => {
  const apps = isArray(App) ? App : [App]
  const filename = config.reportFilename
    ? `${config.reportFilename}_${Date.now()}_result.json`
    : `${Date.now()}_result.json`
  const reporter = new JSONStreamReporter({ filename: path.join('/results', filename) })
  // const reporter = new ZeroMqReporter({ channel: 'zzz' })

  const crawler = new Crawler({
    benchmark: true,
    logger,
    reporter,
    // queue: config.queueKey ? new RedisURLQueue({ redisKey: config.queueKey, redisOptions: {} }) : undefined,
    name: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    requestOptions: {
      rejectUnauthorized: false
    },
    ...config
  })
  crawler
    .addApp(config => new Blacklist(config))
    .addApp({ preRequest: (url) => { console.log(url.toString()) } })
    // .addApp(config => new OnlyDownloadSpecificTypes(config))
    .addApp(config => new ThrottleRequests(config))
    // .addApp(new MetaDataExtractor())
    .addApp(config => new RobotsTxtAdvisor(config))
    .addApp(config => new HttpLinkExpander(config))
    .addApp(config => new SelectorExpander(config))
  apps.forEach(App => {
    crawler.addApp(config => new App(config))
  })
  crawler
    .on('finish', reporter => {
      reporter.closeStream()
        .then(() => {
          logger.info('Nothing left todo. Goodbye!')
          process.exit(0)
        })
    })
    .seed(seedUrls)
    .then(() => crawler.start())

  process.on('exit', (...args) => {
    console.log('Benchmark:', crawler.benchmarkReport())
    fs.writeFileSync(path.join(__dirname, '../results', filename.replace('_result', '_meta')), JSON.stringify({
      exitReason: EXIT_REASON || 'finished',
      linksOpen: crawler.queue.urlsTodo.map(u => u.href)
    }, null, 2))
    reporter.closeStream()
      .then(() => {
        logger.info(`about to leave… saving data to 'results/${filename}'`)
        endScript()
      })
  })

  // Catch CTRL+C
  process.on('SIGINT', () => {
    EXIT_REASON = 'User interrupt'
    process.exit(0)
  })

  function endScript () {
    const cbResponse = cb && cb(filename)
    if (cbResponse) {
      cbResponse.then(() => process.exit(0))
    } else {
      process.exit(0)
    }
  }
}

export const testRun = (App, testUrl, config) => {
  const crawler = new Crawler({
    benchmark: true,
    logger,
    name: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    requestOptions: {
      rejectUnauthorized: false
    },
    ...config
  })
  crawler
    .addApp(config => new Blacklist(config))
    .addApp({ name: 'console.log', preRequest: (url) => { console.log(url.toString()) } })
    .addApp(config => new App(config))
    .on('finish', reporter => {
      console.log('Benchmark:', crawler.benchmarkReport())
      const result = reporter.toJson()
      Object.keys(result).forEach(url => {
        console.log(url, result[url])
      })
      logger.info('Nothing left todo. Goodbye!')
      process.exit(0)
    })
    .test(testUrl)
}
