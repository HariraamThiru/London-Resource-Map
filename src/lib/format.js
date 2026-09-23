export function formatDate(isoDate, locale) {
  // Noon avoids the date shifting by a day in time zones behind UTC.
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// "1.2" in English and "1,2" in French. Whole numbers once it's 10 km or more.
export function formatDistance(km, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km)
}
