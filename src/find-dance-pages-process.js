import path from 'path'
import { URL } from 'url'
import fs from 'fs'
import uniq from 'lodash/uniq'

const fileName = path.join(__dirname, '../results/findDancePages_1517321998258_result.json')

const data = JSON.parse(fs.readFileSync(fileName) + ']')

const allLinks = Object.values(data
  .reduce((memo, item) => {
    memo[item.url] = {
      ...(memo[item.url] || {}),
      ...item
    }
    return memo
  }, {}))
  .filter(item => (item.keywords && item.keywords.length) || (item.keywordCount && item.keywordCount.count))
  .filter(item => item.keywords.indexOf('tanzen') !== -1)
  .filter(item => item.url.indexOf('hamburg.de/') === -1)
  .filter(item => item.url.indexOf('kieler-woche.de/') === -1)
  .filter(item => item.url.indexOf('youtube.com') === -1)
  .filter(item => item.url.indexOf('johanneszeiske') === -1)
  .filter(item => item.url.indexOf('mopo.de') === -1)
  .filter(item => item.url.indexOf('wikipedia.org') === -1)
  .filter(item => item.url.indexOf('wikimedia.org') === -1)
  .filter(item => item.url.indexOf('berlin-magazin.info') === -1)
  .filter(item => item.url.indexOf('royalsocietypublishing.org') === -1)
  .filter(item => item.url.indexOf('traumgmbh.de') === -1)
  .filter(item => item.url.indexOf('twitter.com') === -1)
  .filter(item => item.url.indexOf('t-online.de') === -1)
  .filter(item => item.url.indexOf('.jpg') === -1)
  .filter(item => item.url.indexOf('/blog/') === -1)
  .filter(item => item.url.indexOf('adticket.de') === -1)

const allDomains = uniq(allLinks.map(item => {
  const u = item.url.split('/')
  return `${u[0]}//${u[2]}`
}))

console.log('The result:')
console.log(allDomains)
console.log(`Have been ${allLinks.length} items in ${allDomains.length} domains`)

fs.writeFileSync(path.join(__dirname, '../finalResults/find-dance-pages.json'), JSON.stringify(allLinks, null, 2))

// In the not shown links there are telefon numbers and mailtos in
