import linkscrape from 'linkscrape'
import main, { testRun } from './main'
import { URL as NodeURL } from 'url'

import { linkExtractor } from 'plugnsearch'
import uniqBy from 'lodash/uniqBy'

// const linkExtractor2 = (html, basePath) =>
//   new Promise(resolve => {
//     linkscrape(basePath, html, (links, $) => {
//       try {
//         const urls = links.map(l => l.link)
//         let result = links
//           .filter(link => link.link !== null) // no # links and javascript: links and stuff
//           .map(link => ({
//             url: link.link,
//             text: link.text,
//             type: link.element.tagName,
//             count: urls.filter(url => url === link.link).length
//           }))

//         resolve(uniqBy(result, l => l.url))
//       } catch(e) {}
//     })
//   })


class SimilarPageDataExtractor {
  name = 'SimilarPageDataExtractor'

  process ({ body, url, $, report, queueUrls }) {
    // console.log(body)
    return new Promise(resolve => {
      linkExtractor(body, url.toString()).then(links => {
        console.log('links', links.filter(x => x.url.indexOf('https://medium.com') == 0))
        resolve()
      })
    })
  }
}

// const REGEX = /www\.immobilienscout24\.de\/Suche\/S-T\/(P-\d+\/)?Anlageobjekte\/Hamburg\/Hamburg(\?.*)?$/
const config = {
  // queueKey: 'hackernews',
  reportFilename: 'hackernews',
  throttle: 1200,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => (
    // Expose pages
    false
  )
  // next list pages
  // expandSelector: 'a[data-nav-next-page="true"]'
}

// main(SimilarPageDataExtractor, [
//   'https://medium.com/@TalPerry/deep-learning-the-stock-market-df853d139e02'
// ], config)

testRun(SimilarPageDataExtractor, 'https://medium.com/@TalPerry/deep-learning-the-stock-market-df853d139e02', config)
