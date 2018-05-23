import main, { testRun } from './main'

class App {
  noCheerio = true

  process ({ body, url, report }) {
    // const sellerName = $('[data-qa="companyName"]')
    if (url.href.indexOf('immobilienscout24.de/expose/') !== -1) {
      console.log(body.match(/IS24\.expose([^(\/script)]*)/)[1]);
      const data = JSON.parse(body.match(/IS24\.expose = (\{.*?\});/)[1])
      console.log(data);
      report('data', data)
    }
  }
}

const REGEX = /www\.immobilienscout24\.de\/Suche\/S-T\/(P-\d+\/)?Anlageobjekte\/Hamburg\/Hamburg(\?.*)?$/
const config = {
  throttle: 1200,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => (
    url.indexOf('https://www.immobilienscout24.de/expose/') === 0 ||
    REGEX.test(url)
  )
}

// main(App, [
//   // 'https://immobilienscout24.de/expose/98697954'
//   'https://www.immobilienscout24.de/Suche/S-T/Anlageobjekte/Hamburg/Hamburg?enteredFrom=one_step_search'
// ], config)

testRun(App, 'https://www.immobilienscout24.de/expose/100721357', config)
