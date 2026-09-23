import { describe, expect, it } from 'vitest'
import { filterResources } from './filterResources.js'

const resources = [
  {
    id: 'food-bank',
    name: 'Downtown Food Bank',
    category: 'food',
    description: 'Groceries for families.',
    address: '1 Main St, London, ON',
    tags: ['groceries'],
  },
  {
    id: 'night-shelter',
    name: 'Night Shelter',
    category: 'shelter',
    description: 'Beds and hot meals.',
    address: '2 King St, London, ON',
    tags: ['meals', 'showers'],
  },
  {
    id: 'library',
    name: 'Central Library',
    category: 'community',
    description: 'Free Wi-Fi and computers.',
    address: '3 Queen St, London, ON',
    tags: ['wifi'],
  },
]

const ids = (list) => list.map((resource) => resource.id)

describe('filterResources', () => {
  it('returns everything when there are no filters', () => {
    expect(ids(filterResources(resources))).toEqual(['food-bank', 'night-shelter', 'library'])
  })

  it('keeps only the selected categories', () => {
    expect(ids(filterResources(resources, { categories: ['food', 'community'] }))).toEqual([
      'food-bank',
      'library',
    ])
  })

  it('matches names, descriptions and tags, ignoring case', () => {
    expect(ids(filterResources(resources, { query: 'LIBRARY' }))).toEqual(['library'])
    expect(ids(filterResources(resources, { query: 'meals' }))).toEqual(['night-shelter'])
    expect(ids(filterResources(resources, { query: 'wifi' }))).toEqual(['library'])
  })

  it('matches category names', () => {
    expect(ids(filterResources(resources, { query: 'community' }))).toEqual(['library'])
  })

  it('requires every word to match', () => {
    expect(ids(filterResources(resources, { query: 'food groceries' }))).toEqual(['food-bank'])
    expect(ids(filterResources(resources, { query: 'food showers' }))).toEqual([])
  })

  it('combines search text and categories', () => {
    expect(ids(filterResources(resources, { query: 'free', categories: ['food'] }))).toEqual([])
    expect(ids(filterResources(resources, { query: 'free', categories: ['community'] }))).toEqual([
      'library',
    ])
  })

  it('ignores blank search text', () => {
    expect(filterResources(resources, { query: '   ' })).toHaveLength(3)
  })
})
