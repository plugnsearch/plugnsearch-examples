import main, { testRun } from './main'

import { DataScraper } from 'plugnsearch-apps'

/**
 * Available types:
 *  - og (parses og)
 *  - html (reads out HTML data)
 */
const MAPPING = {
  'https://immobilienscout24.de/neubau/frankonia-eurobau-investment-sophienterrasse-gmbh/sophienterrassen/60255.html': {
    'FIX': {
      'exposeType': 'Neubau'
    }
    // @TODO
  },
  'https://immobilienscout24.de/expose': {
    'FIX': {
      foundAt: Date.now(),
      exposeType: 'Rent'
    },
    'BODY': {
      realtorName: body => {
        try {
          return JSON.parse(body.match(/"realtorInformation":(\{.*?\})/)[1])
        } catch (e) {}
      }
    },
    'HTML': {
      totalRent: '.is24qa-gesamtmiete',
      rent: '.is24qa-kaltmiete',
      costs: '.is24qa-nebenkosten',
      heating: '.is24qa-heizkosten',
      area: '.is24qa-wohnflaeche-ca',
      rooms: '.is24qa-zimmer',
      type: '.is24qa-typ',
      level: '.is24qa-etage',
      condition: '.is24qa-objektzustand',
      quality: '.is24qa-qualitaet-der-ausstattung',
      energyPass: '.is24qa-energieausweis',
      startsAt: '.is24qa-bezugsfrei-ab',
      deposit: '.is24qa-kaution-o-genossenschaftsanteile',
      image: $ => $('img.sp-image').map((i, elem) => $(elem).data('src')).get(),
      address: '[data-qa="is24-expose-address"] .address-block',
      description: '.is24qa-objektbeschreibung',
      interior: '.is24qa-ausstattung'
    },
    postProcess: {
      type: 'trim',
      level: 'trim',
      startsAt: 'trim',
      area: 'trim',
      address: 'trim',
      condition: 'trim',
      energyPass: 'trim',
      quality: 'trim',
      rooms: 'int',
      deposit: 'money',
      totalRent: 'money',
      rent: 'money',
      costs: 'money',
      heating: 'money'
    },
    processors: {
      int: v => parseInt((v || '').trim(), 10),
      money: v => (v || '').split('\n')[0].replace('€', '').replace('+', '').trim(),
      trim: v => (v || '').trim()
    }
  }
}

const EXPOSE_PAGE_REGEX = /\/expose\/\d+$/

// const REGEX = /www\.immobilienscout24\.de\/Suche\/S-T\/(P-\d+\/)?Anlageobjekte\/Hamburg\/Hamburg(\?.*)?$/
const config = {
  queueKey: 'immobilien',
  reportFilename: 'immobilien',
  throttle: 1200,
  // onlySpecificContentTypes: /html/, THIS HAS A PROBLEM for some reason
  urlFilter: url => (
    // Expose pages
    EXPOSE_PAGE_REGEX.test(url)
  ),
  // next list pages
  expandSelector: 'a[data-nav-next-page="true"]',
  dataMapping: MAPPING
}

main(DataScraper, [
  'https://www.immobilienscout24.de/Suche/S-T/Wohnung-Miete/Hamburg/Hamburg'
  // 'https://www.immobilienscout24.de/Suche/S-T/Anlageobjekte/Hamburg/Hamburg?enteredFrom=one_step_search'
], config)

// testRun(DataScraper, 'https://immobilienscout24.de/expose/97931521', config)
