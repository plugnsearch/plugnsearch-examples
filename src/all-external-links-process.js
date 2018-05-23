import path from 'path'
import fs from 'fs'
import { URL } from 'url'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'

const fileName = path.join(__dirname, '../results/newstral-links_1517249150479_result.json')

const data = JSON.parse(fs.readFileSync(fileName))

const allLinks = data.filter(item => item.externalLink).map(item => item.externalLink).flatten()

const uniqLinks = uniq(allLinks).map(x => x.replace('target:_blank/', ''))
const uniqDomains = uniqBy(uniqLinks
  .map(link => {
    const url = (new URL(link))
    if (url.protocol.indexOf('http') === 0) {
      return `${url.protocol}//${url.host}`
    }
  }),
  // remove duplicates between http: and htpps
  link => link && (new URL(link)).host
)
  .filter(x => x)

console.log('The result:')
console.log(uniqDomains)
console.log(`Have been ${uniqDomains.length} items`)

fs.writeFileSync(path.join(__dirname, '../finalResults/hamburg-dance-pages-from-newstral.json'), JSON.stringify(uniqDomains, null, 2))

// In the not shown links there are telefon numbers and mailtos in
