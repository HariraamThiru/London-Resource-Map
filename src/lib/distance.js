const EARTH_RADIUS_KM = 6371

// Straight-line ("as the crow flies") distance between two { lat, lng } points,
// using the haversine formula, which accounts for the Earth being round.
export function distanceKm(from, to) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const deltaLat = toRadians(to.lat - from.lat)
  const deltaLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(deltaLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}
