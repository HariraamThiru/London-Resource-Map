import { describe, expect, it } from 'vitest'
import { distanceKm } from './distance.js'

const CENTRAL_LIBRARY = { lat: 42.984615, lng: -81.246075 }
const MASONVILLE_LIBRARY = { lat: 43.025239, lng: -81.275355 }

describe('distanceKm', () => {
  it('is zero between a point and itself', () => {
    expect(distanceKm(CENTRAL_LIBRARY, CENTRAL_LIBRARY)).toBe(0)
  })

  it('measures one degree of latitude as about 111 km', () => {
    expect(distanceKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(111.19, 1)
  })

  it('gives the same distance in both directions', () => {
    expect(distanceKm(CENTRAL_LIBRARY, MASONVILLE_LIBRARY)).toBeCloseTo(
      distanceKm(MASONVILLE_LIBRARY, CENTRAL_LIBRARY),
      9,
    )
  })

  it('puts the Central and Masonville libraries about 5 km apart', () => {
    const distance = distanceKm(CENTRAL_LIBRARY, MASONVILLE_LIBRARY)
    expect(distance).toBeGreaterThan(4.5)
    expect(distance).toBeLessThan(5.5)
  })
})
