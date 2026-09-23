import { useLanguage } from '../i18n/LanguageContext.jsx'
import { isOpenAt } from '../lib/hours.js'

// "Open now" or "Closed now". Shows nothing when a service's hours aren't published.
export default function OpenStatus({ hours, now }) {
  const { t } = useLanguage()
  const open = isOpenAt(hours, now)
  if (open === null) return null

  return (
    <span className={open ? 'status status--open' : 'status status--closed'}>
      {open ? t.statusOpen : t.statusClosed}
    </span>
  )
}
