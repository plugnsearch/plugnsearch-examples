/**
 * This script goes out by a list from urls and searches for more dance related
 * domains with given depth
 */
import path from 'path'
import fs from 'fs'

import MetaDataExtractor from '../apps/MetaDataExtractor'
import KeywordExtractor from '../apps/KeywordExtractor'
import main, { testRun } from './main'

const config = {
  reportFilename: 'findDancePages',
  queueKey: 'findDancePages',
  throttle: 1200,
  // maxDepth: 10,
  // maxDepthLogging: true,
  blacklist: `
    .hamburg.de
    vimeo.
    youtube.com
    youtu.be
    facebook.com
    borchers-hamburg.de
    /wp-content/uploads/
    stageclub.de
    soundcloud.com
    mixcloud.com
    pinterrest
  `.split(' '),
  keywords: `
    tanzschule tanzunterricht
    tanzveranstaltung tanzveranstaltungen
    tanzparties tanzparty
    tanzevent tanzevents
    tanzkalendar
    standardtanz lateintanz
    salsa walzer swing zouk forro forró
  `.split(' '),
  onlySpecificContentTypes: /html/
  // urlFilter: url => false // not follwing for anything now
}

const processResult = (filename) => {
  console.log('Result is in file: ', filename)
}

// const seedUrls = JSON.parse(fs.readFileSync(path.join(__dirname, '../finalResults/hamburg-dance-pages-from-zeiske.json')))
// const seedUrls = JSON.parse(fs.readFileSync(path.join(__dirname, '../results/findDancePages_1517240026778_meta.json'))).linksOpen
const seedUrls = [
  "http://www.johanneszeiske.de",
  "https://www.tanzschulebuck.com",
  "http://www.salsaland.de",
  "https://docs.google.com",
  "http://www.openstreetmap.org",
  "http://www.belami-hamburg.de",
  "https://heidetango-e-v.jimdo.com",
  "http://l.facebook.com",
  "http://www.radiohamburg.de",
  "http://www.almatango.de",
  "http://www.latin-dance-education.de",
  "http://www.eberts.de",
  "http://www.harburg-aktuell.de",
  "http://www.diekleineswingbrause.de",
  "http://www.zeise.de",
  "http://hanse-travemuende.de",
  "http://www.tanzsport-hsv.de",
  "http://www.potofsalsa.com",
  "http://www.heidenauer-hof.de",
  "https://www.queerball.de",
  "http://www.tanzgruppe-herde.de",
  "http://www.salsahh.de",
  "http://www.bewegte-stunden.de",
  "http://mb4.me",
  "http://www.altonale.de",
  "https://swingme.mercedes-me-store-hamburg.de",
  "http://vfl-tanzsport.de",
  "http://www.hamburger-theaternacht.de",
  "http://sophiavonblacha.com",
  "http://johanneszeiske.de",
  "http://www.liveartcentrum.com",
  "http://layumba.de",
  "http://www.die-burg-barmbek.de",
  "http://wemeetz.weebly.com",
  "http://www.tinapott.de",
  "https://www.eventbrite.de",
  "http://www.mix-fete.de",
  "http://www.toulouse.de",
  "http://www.tanzschule-bartel.de",
  "http://www.tangoymas.net",
  "http://kukuun.com",
  "http://soundcloud.com",
  "http://www.wcs-wagner.de",
  "http://tomfort-tanz.de",
  "http://kueche42.de",
  "http://www.fintango.de",
  "http://www.tangomatrix.de",
  "http://www.tanzschule-am-buergerpark.de",
  "http://lsbg.hamburg.de",
  "http://www.peter-moeller.info",
  "https://www.swingaway.de",
  "http://www.abindenmai.de",
  "http://folkstanzwirbel.de"
]
seedUrls.sort(() => Math.random() - 0.5)

main([
  MetaDataExtractor,
  KeywordExtractor
], seedUrls, config, processResult)

// testRun(App, 'https://immobilienscout24.de/expose/98697954', config)
