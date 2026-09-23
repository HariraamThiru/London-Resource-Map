import { CATEGORY_BY_ID } from './categories.js'

/**
 * Returns the services in the selected categories that match every word of the
 * search text. An empty category list means "all categories".
 */
export function filterResources(resources, { query = '', categories = [] } = {}) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)

  return resources.filter((resource) => {
    if (categories.length > 0 && !categories.includes(resource.category)) {
      return false
    }

    const searchable = [
      resource.name,
      resource.description,
      resource.address,
      CATEGORY_BY_ID[resource.category]?.label,
      ...(resource.tags ?? []),
    ]
      .join(' ')
      .toLowerCase()

    return words.every((word) => searchable.includes(word))
  })
}
