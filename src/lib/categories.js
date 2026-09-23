// Each color is dark enough to put white text on it (WCAG AA). Categories are
// always named in text too, so color is never the only way to tell them apart.
export const CATEGORIES = [
  { id: 'food', label: 'Food', color: '#c2410c' },
  { id: 'shelter', label: 'Shelter', color: '#1d4ed8' },
  { id: 'health', label: 'Health', color: '#15803d' },
  { id: 'mental-health', label: 'Mental health', color: '#7e22ce' },
  { id: 'community', label: 'Library & community', color: '#be185d' },
]

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
)
