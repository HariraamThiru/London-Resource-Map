import { STRINGS } from '../i18n/strings.js'

// Opening hours are stored in London, Ontario time, in one of three forms:
//   { "mon": ["09:00-16:00"], "sat": ["09:00-11:00"] }   days that are left out are closed
//   "always"                                             open 24 hours, every day
//   null                                                 the hours aren't published
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const NOON = 12 * 60

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// "09:30-16:00" → { start: 570, end: 960 }, in minutes after midnight.
export function parseRange(range) {
  const [start, end] = range.split('-')
  return { start: toMinutes(start), end: toMinutes(end) }
}

const londonClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Toronto',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

// The day and time in London, Ontario, whatever time zone the visitor is in.
export function londonTime(date = new Date()) {
  const parts = Object.fromEntries(
    londonClock.formatToParts(date).map(({ type, value }) => [type, value]),
  )
  return {
    day: parts.weekday.slice(0, 3).toLowerCase(),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

// true or false, or null when the hours aren't known.
export function isOpenAt(hours, { day, minutes }) {
  if (hours === 'always') return true
  if (!hours) return null
  return (hours[day] ?? []).some((range) => {
    const { start, end } = parseRange(range)
    return minutes >= start && minutes < end
  })
}

// Merges back-to-back days that have the same hours, so Mon–Fri 9–4 is one group instead of five.
export function groupDays(hours) {
  const groups = []
  DAYS.forEach((day, index) => {
    const ranges = hours[day]
    if (!ranges?.length) return
    const previous = groups.at(-1)
    if (previous && previous.lastIndex === index - 1 && previous.ranges.join() === ranges.join()) {
      previous.days.push(day)
      previous.lastIndex = index
    } else {
      groups.push({ days: [day], ranges, lastIndex: index })
    }
  })
  return groups.map(({ days, ranges }) => ({ days, ranges }))
}

// Non-breaking spaces ( ) keep "9 am" and "9 h" from being split across lines.
function formatTime(minutes, language, withPeriod = true) {
  const hours = Math.floor(minutes / 60)
  const extraMinutes = minutes % 60
  const paddedMinutes = String(extraMinutes).padStart(2, '0')

  if (language === 'fr') {
    return extraMinutes ? `${hours} h ${paddedMinutes}` : `${hours} h`
  }
  const hour12 = hours % 12 || 12
  const clock = extraMinutes ? `${hour12}:${paddedMinutes}` : `${hour12}`
  return withPeriod ? `${clock} ${minutes < NOON ? 'am' : 'pm'}` : clock
}

function formatRange(range, language) {
  const { start, end } = parseRange(range)
  if (language === 'fr') {
    return `${formatTime(start, 'fr')} à ${formatTime(end, 'fr')}`
  }
  // Write "9–11 am" rather than "9 am–11 am" when both times are on the same side of noon.
  const samePeriod = start < NOON === end < NOON
  return `${formatTime(start, 'en', !samePeriod)}–${formatTime(end, 'en')}`
}

// Lines like "Mon–Fri: 9 am–4 pm" (or "lun.–ven. : 9 h à 16 h"), ready to display.
export function formatHours(hours, language) {
  const strings = STRINGS[language]
  if (hours === 'always') return [strings.openAlways]
  if (!hours) return [strings.hoursUnknown]

  return groupDays(hours).map(({ days, ranges }) => {
    const firstDay = strings.days[days[0]]
    const dayText = days.length === 1 ? firstDay : `${firstDay}–${strings.days[days.at(-1)]}`
    const timeText = ranges.map((range) => formatRange(range, language)).join(', ')
    return `${dayText}${strings.dayTimeSeparator}${timeText}`
  })
}
