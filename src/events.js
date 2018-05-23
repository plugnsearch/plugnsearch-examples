
/**
 * Available types:
 *  - og (parses og)
 *  - html (reads out HTML data)
 */
const MAPPING = {
  'http://www.salsabor.de/events/salsa-aktuelle-events/': {
    'http://www.salsabor.de/Veranstaltung/': {
      'OG': {
        title: 'og:title',
        url: 'og:url',
        location: 'og:site_name',
        description: 'og:description',
        image: 'og:image'
      },
      HTML: {
        // 'title': '.entry-title',
        'time': '.dt-duration',
        'address': '.p-location',
        'price': '.ai1ec-cost .ai1ec-col-md-7'
        // 'description': '#post-10469 p'
      }
    }
  },
  'https://www.hiertanztmuenchen.de/veranstaltungskalender.php': {
    'https://www.hiertanztmuenchen.de/termine.php': {
      'HTML': {
        title: 'h2:nth-child(2)',
        description: '#contentmiddle div p',
        address: 'tr:nth-child(2) td:nth-child(2)',
        time: 'tr:nth-child(2) td:nth-child(2)'
      }
    }
  },
  'http://atsv-tanzen.de/index.php/veranstaltungen': {},
  'http://salsaclub-munich.de/30_partys-events.php': {
    'http://salsaclub-munich.de/30_partys-events.php': {
      HTML: [{
        'description': '#content_inhalt :nth-child(4)'
        // TODO
      }]
    }
  },
  'https://www.tanzschule-gutmann.de/freiburg/erwachsene/events/': {
    'https://www.tanzschule-gutmann.de/freiburg/erwachsene/events/': {
      MULTI_HTML: {
        '.eventon_list_event': [{
          title: '.evcal_event_title',
          time: $ => `${$('.evo_start .date').text()}.${$('.evo_start .month').text()}.${$('[data-syr]').data('syr')}T${($('.evo_start .time').text() || '').replace(/\(.*\)/, '')}`,
          timeEnd: $ => `${$('.evo_end .date').text()}.${$('.evo_end .month').text()}.${$('[data-syr]').data('syr')}T${($('.evo_end .time').text() || '').replace(/\(.*\)/, '')}`,
          location: '.event_location_name',
          latlng: $ => $('.evcal_location').data('latlng'),
          price: '[data-filter="event_type_2"]',
          dances: ['[data-filter="event_type_5"]']
        }]
      }
    }
  },
  'http://vfl-tanzsport.de/categories/tanzveranstaltung/': {
    'http://vfl-tanzsport.de/categories/tanzveranstaltung/': {
      //TODO
    }
  }
}
