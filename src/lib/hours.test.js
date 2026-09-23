import { describe, expect, it } from 'vitest'
import { formatHours, isOpenAt, londonTime } from './hours.js'

const WEEKDAYS_AND_SATURDAY = {
  mon: ['09:00-16:00'],
  tue: ['09:00-16:00'],
  wed: ['09:00-16:00'],
  thu: ['09:00-16:00'],
  fri: ['09:00-16:00'],
  sat: ['09:00-11:00'],
}

describe('isOpenAt', () => {
  it('is always open for services open around the clock', () => {
    expect(isOpenAt('always', { day: 'sun', minutes: 3 * 60 })).toBe(true)
  })

  it("returns null when the hours aren't known", () => {
    expect(isOpenAt(null, { day: 'mon', minutes: 10 * 60 })).toBeNull()
  })

  it('is open between opening and closing time', () => {
    expect(isOpenAt(WEEKDAYS_AND_SATURDAY, { day: 'mon', minutes: 9 * 60 })).toBe(true)
    expect(isOpenAt(WEEKDAYS_AND_SATURDAY, { day: 'sat', minutes: 10 * 60 + 59 })).toBe(true)
  })

  it('is closed before opening, at closing time, and on days that are left out', () => {
    expect(isOpenAt(WEEKDAYS_AND_SATURDAY, { day: 'mon', minutes: 8 * 60 + 59 })).toBe(false)
    expect(isOpenAt(WEEKDAYS_AND_SATURDAY, { day: 'mon', minutes: 16 * 60 })).toBe(false)
    expect(isOpenAt(WEEKDAYS_AND_SATURDAY, { day: 'sun', minutes: 12 * 60 })).toBe(false)
  })

  it('handles days with a break in the middle', () => {
    const hours = { mon: ['09:30-11:00', '12:00-13:30'] }
    expect(isOpenAt(hours, { day: 'mon', minutes: 11 * 60 + 30 })).toBe(false)
    expect(isOpenAt(hours, { day: 'mon', minutes: 12 * 60 + 15 })).toBe(true)
  })
})

describe('londonTime', () => {
  it('uses London time in summer (EDT, UTC−4)', () => {
    // 3:30 am UTC on Wednesday is still 11:30 pm Tuesday in London.
    expect(londonTime(new Date('2026-09-23T03:30:00Z'))).toEqual({ day: 'tue', minutes: 23 * 60 + 30 })
  })

  it('uses London time in winter (EST, UTC−5)', () => {
    expect(londonTime(new Date('2026-01-15T14:00:00Z'))).toEqual({ day: 'thu', minutes: 9 * 60 })
  })
})

describe('formatHours', () => {
  it('groups back-to-back days with the same hours, in English', () => {
    expect(formatHours(WEEKDAYS_AND_SATURDAY, 'en')).toEqual([
      'Mon–Fri: 9 am–4 pm',
      'Sat: 9–11 am',
    ])
  })

  it('uses French day names and 24-hour times in French', () => {
    expect(formatHours(WEEKDAYS_AND_SATURDAY, 'fr')).toEqual([
      'lun.–ven. : 9 h à 16 h',
      'sam. : 9 h à 11 h',
    ])
  })

  it('shows minutes and more than one time range', () => {
    const hours = { mon: ['09:30-11:00', '12:00-13:30'] }
    expect(formatHours(hours, 'en')).toEqual(['Mon: 9:30–11 am, 12–1:30 pm'])
    expect(formatHours(hours, 'fr')).toEqual([
      'lun. : 9 h 30 à 11 h, 12 h à 13 h 30',
    ])
  })

  it("doesn't group days that aren't next to each other", () => {
    const hours = { mon: ['09:00-16:00'], wed: ['09:00-16:00'] }
    expect(formatHours(hours, 'en')).toEqual(['Mon: 9 am–4 pm', 'Wed: 9 am–4 pm'])
  })

  it('describes services that are always open or have no published hours', () => {
    expect(formatHours('always', 'en')).toEqual(['Open 24 hours, every day'])
    expect(formatHours(null, 'fr')).toEqual(['Heures non indiquées. Appelez avant de vous déplacer.'])
  })
})
