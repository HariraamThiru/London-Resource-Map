import { describe, expect, it } from 'vitest'
import { CATEGORY_BY_ID } from '../lib/categories.js'
import resources from './resources.json'

// A box around London, Ontario. Catches geocoding mistakes, like a match in London, England.
const LONDON_ON = { south: 42.8, north: 43.1, west: -81.45, east: -81.05 }

describe('resources.json', () => {
  it('gives every service a unique id', () => {
    const ids = resources.map((resource) => resource.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(resources.map((resource) => [resource.name, resource]))(
    '%s has complete details',
    (_name, resource) => {
      expect(resource.id).toMatch(/^[a-z0-9-]+$/)
      expect(CATEGORY_BY_ID).toHaveProperty(resource.category)
      expect(resource.description).toBeTruthy()
      expect(resource.address).toContain('London, ON')
      expect(resource.source).toMatch(/^https:\/\//)
      expect(resource.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (resource.website) {
        expect(resource.website).toMatch(/^https:\/\//)
      }
    },
  )

  it.each(resources.map((resource) => [resource.name, resource]))(
    '%s is on the map in London, Ontario',
    (_name, resource) => {
      expect(resource.lat).toBeGreaterThan(LONDON_ON.south)
      expect(resource.lat).toBeLessThan(LONDON_ON.north)
      expect(resource.lng).toBeGreaterThan(LONDON_ON.west)
      expect(resource.lng).toBeLessThan(LONDON_ON.east)
    },
  )
})
