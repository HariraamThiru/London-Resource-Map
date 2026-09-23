export function directionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

// Dials the main number. Extensions ("ext. 101") are shown but left off the link.
export function phoneHref(phone) {
  const [mainNumber] = phone.split(/ext/i)
  return `tel:${mainNumber.replace(/[^\d+]/g, '')}`
}

export function formatDate(isoDate) {
  // Noon avoids the date shifting by a day in time zones behind UTC.
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
