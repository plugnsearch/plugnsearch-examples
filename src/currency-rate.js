import path from 'path'
import fs from 'fs'
import Occurences from 'occurences'

import MetaDataExtractor from '../apps/MetaDataExtractor'
import main, { testRun } from './main'

export default class CurrencyParser {
  name = 'CurrencyParser'

  process ({ body, $, report }) {
    report('exchange-rate', {
      eur: parseFloat($('#display-amount').val().replace(',', '.')),
      czk: parseFloat($('#currency-conversion-result').val().replace(',', '.'))
    })
  }
}

const config = {
  reportFilename: 'currency',
  throttle: 10, // all different domain, so less throttle
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => false // not follwing for anything now
}

const processResult = (filename) => {
  console.log('Result is in file: ', filename)
}

const seedUrl = 'https://www.finanzen.net/waehrungsrechner/euro_tschechische-krone'

main([
  CurrencyParser
], seedUrl, config, processResult)

// testRun(CurrencyParser, seedUrl, config)
