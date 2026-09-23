import { describe, expect, it } from 'vitest'
import { filterResources } from './filterResources.js'

const resources = [
  {
    id: 'food-bank',
    name: 'Downtown Food Bank',
    category: 'food',
    address: '1 Main St, London, ON',
    description: { en: 'Groceries for families.', fr: 'Épicerie pour les familles.' },
    tags: { en: ['groceries'], fr: ['épicerie'] },
    hours: { mon: ['09:00-16:00'] },
  },
  {
    id: 'night-shelter',
    name: 'Night Shelter',
    category: 'shelter',
    address: '2 King St, London, ON',
    description: { en: 'Beds and hot meals.', fr: 'Lits et repas chauds.' },
    tags: { en: ['meals', 'showers'], fr: ['repas', 'douches'] },
    hours: 'always',
  },
  {
    id: 'library',
    name: 'Central Library',
    category: 'community',
    address: '3 Queen St, London, ON',
    description: { en: 'Free Wi-Fi and computers.', fr: 'Wi-Fi gratuit et ordinateurs.' },
    tags: { en: ['wifi'], fr: ['wifi'] },
    hours: null,
  },
]

const MONDAY_10_AM = { day: 'mon', minutes: 10 * 60 }
const MONDAY_8_PM = { day: 'mon', minutes: 20 * 60 }

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

  it('matches category names in either language', () => {
    expect(ids(filterResources(resources, { query: 'community' }))).toEqual(['library'])
    expect(ids(filterResources(resources, { query: 'hébergement' }))).toEqual(['night-shelter'])
  })

  it('matches French words, with or without accents', () => {
    expect(ids(filterResources(resources, { query: 'repas' }))).toEqual(['night-shelter'])
    expect(ids(filterResources(resources, { query: 'epicerie' }))).toEqual(['food-bank'])
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

  it('keeps only services known to be open at the given time', () => {
    expect(ids(filterResources(resources, { openAt: MONDAY_10_AM }))).toEqual([
      'food-bank',
      'night-shelter',
    ])
    expect(ids(filterResources(resources, { openAt: MONDAY_8_PM }))).toEqual(['night-shelter'])
  })
})
