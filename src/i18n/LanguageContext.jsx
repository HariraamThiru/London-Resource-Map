import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, STRINGS } from './strings.js'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'language'

// Starting language: a shared link (?lang=fr) first, then the visitor's last
// choice, then their browser's language.
function initialLanguage() {
  const fromLink = new URLSearchParams(window.location.search).get('lang')
  if (fromLink in STRINGS) return fromLink
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved in STRINGS) return saved
  } catch {
    // Storage can be blocked, for example in private browsing. Carry on without it.
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)
  const { locale } = LANGUAGES.find((option) => option.code === language)

  // Screen readers use the page's lang attribute to pick a voice and pronunciation.
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = STRINGS[language].title
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Same as above: remembering the choice is a nice-to-have.
    }
  }, [language, locale])

  const value = useMemo(
    () => ({
      language,
      locale,
      setLanguage,
      t: STRINGS[language],
      // Picks this language's version of a translated field, falling back to English.
      localize: (field) => field?.[language] ?? field?.en,
    }),
    [language, locale],
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
