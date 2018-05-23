import main, { testRun } from './main'
import { URL as NodeURL } from 'url'

/**
 * Ensures that returned url is an aboslute one. If given url is relative, it uses
 * the base of baseUrl to make it absolute.
 */
function makeUrlAbsolute (baseUrl, url) {
  const urlObject = new NodeURL(url, baseUrl)
  return urlObject.href
}

class HackerNewsExtractor {
  name = 'HackerNewsExtractor'

  process ({ url, $, report, queueUrls }) {
    if (url.href.match('news.ycombinator.com')) {
      const entries = []

      $('.athing').each((index, item) => {
        const row = $(item)
        const link = row.find('.title a')
        const subline = row.next()
        const hnUser = subline.find('a.hnuser')
        entries.push({
          pos: parseInt(row.find('.rank').text(), 10),
          title: link.text(),
          link: makeUrlAbsolute(url.href, link.attr('href')),
          points: parseInt(subline.find('.score').text(), 10),
          user: {
            name: hnUser.text(),
            url: hnUser.attr('href')
          },
          numComments: parseInt(subline.find('a:last-child').text(), 10),
          checkedAt: Date.now()
        })
      })
      // queueUrls(entries.map(item => item.link))
      const nextPageUrl = makeUrlAbsolute(url.href, $('a.morelink').attr('href'))
      if (nextPageUrl) queueUrls(nextPageUrl)
      report('entries', entries)
    } else {
      // TODO: Get content
    }
  }
}

const EXPOSE_PAGE_REGEX = /\/expose\/\d+$/

// const REGEX = /www\.immobilienscout24\.de\/Suche\/S-T\/(P-\d+\/)?Anlageobjekte\/Hamburg\/Hamburg(\?.*)?$/
const config = {
  // queueKey: 'hackernews',
  reportFilename: 'hackernews',
  throttle: 1200,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => (
    // Expose pages
    EXPOSE_PAGE_REGEX.test(url)
  ),
  // next list pages
  expandSelector: 'a[data-nav-next-page="true"]'
}

main(HackerNewsExtractor, [
  'https://news.ycombinator.com'
], config)

// testRun(HackerNewsExtractor, 'https://news.ycombinator.com/', config)
