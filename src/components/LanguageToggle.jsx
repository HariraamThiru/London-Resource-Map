import { useLanguage } from '../i18n/LanguageContext.jsx'
import { LANGUAGES } from '../i18n/strings.js'

// Shows the other language's name in that language ("Français" / "English").
// The lang attribute tells screen readers how to pronounce it.
// With more than two languages, this would become a dropdown.
export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const other = LANGUAGES.find((option) => option.code !== language)

  return (
    <button
      type="button"
      className="language-toggle"
      lang={other.locale}
      onClick={() => setLanguage(other.code)}
    >
      {other.label}
    </button>
  )
}
