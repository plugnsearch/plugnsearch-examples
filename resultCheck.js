
import result from './results/1516572800052.json'

const keys = Object.keys(result).filter(key => key !== 'linksOpen' && key !== 'reason')
const numCrawled = keys.length

const numEmpty = keys.filter(key => !(result[key].keywords && result[key].keywords[0])).length

console.log('total', numCrawled)
console.log('empty', numEmpty)
console.log('dancepages', numCrawled - numEmpty)
