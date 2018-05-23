import { URL } from 'url'
import { linkExtractor } from 'plugnsearch'
import uniq from 'lodash/uniq'

import main, { testRun } from './main'

export default class ExtractAllExternalLinks {
  name = 'ExtractAllExternalLinks'
  noCheerio = true

  constructor ({ onlyExternalDomains = false }) {
    this.onlyExternalDomains = onlyExternalDomains
  }

  process ({ body, url, queueUrls, report }) {
    return linkExtractor(body, url.href)
      .then(links => {
        let externalLinks = []
        const broken = []
        links.map(link => link.url)
          .forEach(newUrl => {
            const thisHost = (new URL(url)).host
            try {
              if ((new URL(newUrl)).host.replace('www.', '') === thisHost.replace('www.', '')) {
                queueUrls(newUrl.split(';')[0])
              } else {
                externalLinks.push(newUrl)
              }
            } catch (e) {
              // log broken URL
              broken.push(newUrl)
            }
          })
        if (this.onlyExternalDomains) {
          externalLinks = uniq(externalLinks.map(link => {
            const url = (new URL(link))
            return `${url.protocol}//${url.host}`
          }))
        }
        if (externalLinks.length) report('externalLink', externalLinks)
        if (broken.length) report('brokenLinks', broken)
      })
  }
}

// const DOMAIN_TO_CRAWL = 'www.johanneszeiske.de'
const DOMAIN_TO_CRAWL = 'newstral.com'

const config = {
  reportFilename: 'newstral-links',
  throttle: 1200,

  onlyExternalDomains: true,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  // urlFilter: url => {
  //   const host = (new URL(url)).host
  //   return host.indexOf(DOMAIN_TO_CRAWL) !== -1
  // }
  urlFilter: () => false // disabled HttpLinkExpander for now
}

const processResult = (filename) => {
  console.log('Result is in file: ', filename)
}

main(ExtractAllExternalLinks, [
  `http://${DOMAIN_TO_CRAWL}`
], config, processResult)

// testRun(App, 'https://immobilienscout24.de/expose/98697954', config)
