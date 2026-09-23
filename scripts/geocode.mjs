// Fills in map coordinates for every service in resources.json that doesn't have them yet.
// Pass --all to look up every service again.
//
// Uses OpenStreetMap's free Nominatim geocoder. Its usage policy allows at most one
// request per second from an app that identifies itself:
// https://operations.osmfoundation.org/policies/nominatim/
import { readFile, writeFile } from 'node:fs/promises'

const DATA_FILE = new URL('../src/data/resources.json', import.meta.url)
const USER_AGENT = 'london-resource-map/1.0 (student project)'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Most addresses start with the street ("926 Leathorne St, London, ON ..."), so a
// structured search works. A service can set `geocodeQuery` when its address
// starts with a building name instead.
async function geocode(resource) {
  const search = resource.geocodeQuery
    ? { q: resource.geocodeQuery }
    : { street: resource.address.split(',')[0], city: 'London', state: 'Ontario', country: 'Canada' }
  const params = new URLSearchParams({ ...search, countrycodes: 'ca', format: 'jsonv2', limit: '1' })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  })
  if (!response.ok) {
    throw new Error(`Nominatim answered ${response.status} for "${resource.address}"`)
  }
  const [match] = await response.json()
  if (!match) return null
  return { lat: Number(Number(match.lat).toFixed(6)), lng: Number(Number(match.lon).toFixed(6)) }
}

const resources = JSON.parse(await readFile(DATA_FILE, 'utf8'))
const lookUpAll = process.argv.includes('--all')
let missing = 0

for (const resource of resources) {
  if (!lookUpAll && resource.lat != null && resource.lng != null) continue

  const coordinates = await geocode(resource)
  if (coordinates) {
    Object.assign(resource, coordinates)
    console.log(`found    ${resource.name}: ${coordinates.lat}, ${coordinates.lng}`)
  } else {
    missing += 1
    console.warn(`missing  ${resource.name}: no match for "${resource.address}"`)
  }
  await wait(1100)
}

await writeFile(DATA_FILE, `${JSON.stringify(resources, null, 2)}\n`)
if (missing > 0) {
  console.warn(`\n${missing} address(es) need coordinates added by hand.`)
  process.exitCode = 1
}
