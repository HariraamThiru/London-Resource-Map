import { describe, expect, it } from 'vitest'
import { LANGUAGES, STRINGS } from './strings.js'

// Describes a strings object by its keys and value types, ignoring the actual text.
function shape(value) {
  if (typeof value === 'function') return 'function'
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
  }
  return typeof value
}

describe('translations', () => {
  it('has strings for every language', () => {
    for (const { code } of LANGUAGES) {
      expect(STRINGS).toHaveProperty(code)
    }
  })

  it.each(LANGUAGES.filter(({ code }) => code !== 'en').map(({ code }) => [code]))(
    '%s has every key English has, and no extras',
    (code) => {
      expect(shape(STRINGS[code])).toEqual(shape(STRINGS.en))
    },
  )
})
