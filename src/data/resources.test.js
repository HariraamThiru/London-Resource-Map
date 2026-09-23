import { describe, expect, it } from 'vitest'
import { LANGUAGES } from '../i18n/strings.js'
import { CATEGORY_BY_ID } from '../lib/categories.js'
import { DAYS, parseRange } from '../lib/hours.js'
import resources from './resources.json'

// A box around London, Ontario. Catches geocoding mistakes, like a match in London, England.
const LONDON_ON = { south: 42.8, north: 43.1, west: -81.45, east: -81.05 }
const TIME_RANGE = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/

const byName = resources.map((resource) => [resource.name, resource])

function expectTranslated(field) {
  for (const { code } of LANGUAGES) {
    expect(typeof field[code], `missing "${code}" translation`).toBe('string')
    expect(field[code].trim()).not.toBe('')
  }
}

describe('resources.json', () => {
  it('gives every service a unique id', () => {
    const ids = resources.map((resource) => resource.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(byName)('%s has complete details', (_name, resource) => {
    expect(resource.id).toMatch(/^[a-z0-9-]+$/)
    expect(CATEGORY_BY_ID).toHaveProperty(resource.category)
    expect(resource.address).toContain('London, ON')
    expect(resource.source).toMatch(/^https:\/\//)
    expect(resource.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    if (resource.website) {
      expect(resource.website).toMatch(/^https:\/\//)
    }
  })

  it.each(byName)('%s is translated into every language', (_name, resource) => {
    expectTranslated(resource.description)
    if (resource.eligibility) expectTranslated(resource.eligibility)
    if (resource.hoursNote) expectTranslated(resource.hoursNote)
    for (const { code } of LANGUAGES) {
      expect(Array.isArray(resource.tags[code]), `missing "${code}" tags`).toBe(true)
    }
  })

  it.each(byName)('%s has valid opening hours', (_name, resource) => {
    expect(resource).toHaveProperty('hours')
    if (resource.hours === 'always' || resource.hours === null) return

    for (const [day, ranges] of Object.entries(resource.hours)) {
      expect(DAYS).toContain(day)
      for (const range of ranges) {
        expect(range).toMatch(TIME_RANGE)
        const { start, end } = parseRange(range)
        expect(end, `${day} ${range} closes before it opens`).toBeGreaterThan(start)
      }
    }
  })

  it.each(byName)('%s is on the map in London, Ontario', (_name, resource) => {
    expect(resource.lat).toBeGreaterThan(LONDON_ON.south)
    expect(resource.lat).toBeLessThan(LONDON_ON.north)
    expect(resource.lng).toBeGreaterThan(LONDON_ON.west)
    expect(resource.lng).toBeLessThan(LONDON_ON.east)
  })
})
