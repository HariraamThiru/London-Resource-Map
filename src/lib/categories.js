// Each color is dark enough to put white text on it (WCAG AA). Categories are
// always named in text too (see `categories` in i18n/strings.js), so color is
// never the only way to tell them apart.
export const CATEGORIES = [
  { id: 'food', color: '#c2410c' },
  { id: 'shelter', color: '#1d4ed8' },
  { id: 'health', color: '#15803d' },
  { id: 'mental-health', color: '#7e22ce' },
  { id: 'community', color: '#be185d' },
]

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
)
