import path from 'path'
import fs from 'fs'
import Occurences from 'occurences'

import MetaDataExtractor from '../apps/MetaDataExtractor'
import main, { testRun } from './main'

export default class KeywordExtractor {
  name = 'KeywordExtractor'
  noCheerio = true

  constructor ({ keywords }) {
    this.keywords = keywords
  }

  process ({ body, report }) {
    const occurrences = new Occurences(body)
    let keywordCount = 0
    const matchingKeywords = []

    this.keywords.forEach(keyword => {
      if (occurrences.stats[keyword]) {
        ++keywordCount
        matchingKeywords.push(keyword)
      }
    })
    report('keywordCount', { count: keywordCount })
    report('keywords', matchingKeywords)
  }
}

const config = {
  reportFilename: 'dancePages',
  throttle: 10, // all different domain, so less throttle
  keywords: `
    dance dancing tanzschule tanzunterricht
    tanz tanzen tanzveranstaltung veranstaltung veranstaltungen
    tanzparties party tanzparty
    event events
    termine kalendar calendar
    ballroom latein
  `.split(' '),
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => false // not follwing for anything now
}

const processResult = (filename) => {
  console.log('Result is in file: ', filename)
}

const seedUrls = JSON.parse(fs.readFileSync(path.join(__dirname, '../finalResults/hamburg-dance-pages-from-zeiske.json')))

main([
  MetaDataExtractor,
  KeywordExtractor
], seedUrls, config, processResult)

// testRun(App, 'https://immobilienscout24.de/expose/98697954', config)
