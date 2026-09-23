import { STRINGS } from '../i18n/strings.js'
import { isOpenAt } from './hours.js'

// Lowercases and removes accents, so "epicerie" finds "épicerie".
function simplify(text) {
  return text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Every translation of a field: { en: 'Meals', fr: 'Repas' } → ['Meals', 'Repas'].
function inEveryLanguage(field) {
  return field ? Object.values(field).flat() : []
}

/**
 * Returns the services in the selected categories that match every word of the
 * search text, in any language. When `openAt` (a London day and time) is given,
 * only services known to be open then are kept. An empty category list means
 * "all categories".
 */
export function filterResources(resources, { query = '', categories = [], openAt = null } = {}) {
  const words = simplify(query).split(/\s+/).filter(Boolean)

  return resources.filter((resource) => {
    if (categories.length > 0 && !categories.includes(resource.category)) {
      return false
    }
    if (openAt && isOpenAt(resource.hours, openAt) !== true) {
      return false
    }

    const searchable = simplify(
      [
        resource.name,
        resource.address,
        ...inEveryLanguage(resource.description),
        ...inEveryLanguage(resource.eligibility),
        ...inEveryLanguage(resource.tags),
        ...Object.values(STRINGS).map((strings) => strings.categories[resource.category]),
      ].join(' '),
    )

    return words.every((word) => searchable.includes(word))
  })
}
