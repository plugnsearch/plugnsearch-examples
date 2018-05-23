import path from 'path'
import fs from 'fs'
import uniqBy from 'lodash/uniqBy'

const fileName = path.join(__dirname, '../results/1517143460176_result.json')

const data = JSON.parse(fs.readFileSync(fileName))

const allRealtorData = data.filter(item => item.realtor).map(item => item.realtor)

const realtors = uniqBy(allRealtorData, r => r.link)

console.log('The result:')
console.log(realtors)
console.log(`Have been ${realtors.length} items`)

fs.writeFileSync(path.join(__dirname, '../finalResults/realtors-of-immobilienscout24-hamburg.json'), JSON.stringify(realtors, null, 2))
