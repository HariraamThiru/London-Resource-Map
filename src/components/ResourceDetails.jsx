import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatDate } from '../lib/format.js'
import { formatHours } from '../lib/hours.js'
import { directionsUrl, phoneHref, suggestUpdateUrl } from '../lib/links.js'

// A link that opens in a new tab and says so to screen reader users, along with
// which service it's for (so ten "Website" links aren't all read out the same way).
function NewTabLink({ href, name, children }) {
  const { t } = useLanguage()
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="visually-hidden">{t.newTab(name)}</span>
    </a>
  )
}

// The details for one service. Used in both the list and the map popups.
export default function ResourceDetails({ resource }) {
  const { language, locale, t, localize } = useLanguage()

  return (
    <>
      <dl className="details">
        {resource.eligibility && (
          <>
            <dt>{t.for}</dt>
            <dd>{localize(resource.eligibility)}</dd>
          </>
        )}
        <dt>{t.address}</dt>
        <dd>{resource.address}</dd>
        <dt>{t.hours}</dt>
        <dd>
          {formatHours(resource.hours, language).map((line) => (
            <span key={line} className="hours-line">
              {line}
            </span>
          ))}
          {resource.hoursNote && <span className="hours-note">{localize(resource.hoursNote)}</span>}
        </dd>
        {resource.phone && (
          <>
            <dt>{t.phone}</dt>
            <dd>
              <a href={phoneHref(resource.phone)}>{resource.phone}</a>
            </dd>
          </>
        )}
      </dl>
      <p className="details__links">
        {resource.website && (
          <NewTabLink href={resource.website} name={resource.name}>
            {t.website}
          </NewTabLink>
        )}
        <NewTabLink href={directionsUrl(resource.address)} name={resource.name}>
          {t.directions}
        </NewTabLink>
      </p>
      <p className="details__meta">
        <NewTabLink href={resource.source} name={resource.name}>
          {t.source}
        </NewTabLink>{' '}
        {t.checked(formatDate(resource.lastChecked, locale))}
        <span aria-hidden="true"> · </span>
        <NewTabLink href={suggestUpdateUrl(resource)} name={resource.name}>
          {t.suggestUpdate}
        </NewTabLink>
      </p>
    </>
  )
}
