export const REPO_URL = 'https://github.com/HariraamThiru/London-Resource-Map'

export function directionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

// Dials the main number. Extensions ("ext. 101") are shown but left off the link.
export function phoneHref(phone) {
  const [mainNumber] = phone.split(/ext/i)
  return `tel:${mainNumber.replace(/[^\d+]/g, '')}`
}

// Opens the "Suggest an update" form (.github/ISSUE_TEMPLATE/suggest-update.yml)
// with the service's name already filled in.
export function suggestUpdateUrl(resource) {
  const params = new URLSearchParams({
    template: 'suggest-update.yml',
    title: `Update: ${resource.name}`,
    service: resource.name,
  })
  return `${REPO_URL}/issues/new?${params}`
}

export function suggestServiceUrl() {
  const params = new URLSearchParams({ template: 'suggest-update.yml', title: 'New service: ' })
  return `${REPO_URL}/issues/new?${params}`
}
