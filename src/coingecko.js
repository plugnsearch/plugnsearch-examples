import request from 'request'
import fs from 'fs'
import main, { testRun } from './main'

const wait = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

class CoinDataExtractor {
  name = 'CoinDataExtractor'

  process ({ url, $, report, queueUrls }) {
    return new Promise((resolve, reject) => {
      const throttle = 1000
      const items = $('#gecko-table-all tbody tr').map((i, elem) => {
        const link = $(elem).find('.coin-content a')
        const url = 'https://www.coingecko.com' + link.attr('href').replace(/\/usd$/, '/eur')
        return {
          name: link.find('.coin-content-name').text(),
          symbol: link.find('.coin-content-symbol').text(),
          url: url,
          csvUrl: url.replace('/en/price_charts/', '/price_charts/export/') + '.csv',
          devScore: $(elem).find('.td-developer_score').text().trim(),
          communityScore: $(elem).find('.td-community_score').text().trim(),
          publicScore: $(elem).find('.td-public_interest_score').text().trim()
        }
      }).get()

      Promise.all(
        items.map(item => {
          const downloadCSVPath = `coins/${item.symbol}.csv`

          // FIXME: Somehow it downloads all, but never finishes (so no report written)
          return wait(throttle)
            .then(() => new Promise(resolve => {
              request.get({
                url: item.csvUrl,
                headers: {
                  'Content-Type': 'text/csv'
                }
              }).on('response', response => {
                if (response.statusCode >= 400) {
                  report('error', `Error (${response.statusCode}) downloading ${downloadCSVPath}`)
                }
              })
              .on('error', err => {
                report('error', `Error (${err}) downloading ${downloadCSVPath}`)
              })
              .on('end', () => setTimeout(() => resolve(), 1000)) // else it somehow aborts writing
              .pipe(fs.createWriteStream(downloadCSVPath))
            }))
        })
      ).then(resolve, reject)
    })
  }
}

const EXPOSE_PAGE_REGEX = /\/expose\/\d+$/

// const REGEX = /www\.immobilienscout24\.de\/Suche\/S-T\/(P-\d+\/)?Anlageobjekte\/Hamburg\/Hamburg(\?.*)?$/
const config = {
  // queueKey: 'hackernews',
  reportFilename: 'coingecko',
  throttle: 1200,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => (
    // Expose pages
    EXPOSE_PAGE_REGEX.test(url)
  ),
  // next list pages
  expandSelector: 'a.coin-content-name'
}

// main(CoinDataExtractor, [
//   'https://news.ycombinator.com'
// ], config)

testRun(CoinDataExtractor, 'https://www.coingecko.com/en/coins/all', config)
