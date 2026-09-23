import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function HelpBanner() {
  const { t } = useLanguage()

  return (
    <aside className="help-banner" aria-label={t.helpLabel}>
      <p>
        <span>
          <strong>{t.emergency}</strong> {t.call} <a href="tel:911">911</a>
        </span>
        <span>
          <strong>{t.crisis}</strong> {t.callOrText} <a href="tel:988">988</a>
        </span>
        <span>
          <strong>{t.otherServices}</strong> {t.call} <a href="tel:211">211</a> {t.orVisit}{' '}
          <a href="https://211ontario.ca" target="_blank" rel="noreferrer">
            211ontario.ca<span className="visually-hidden">{t.newTabGeneric}</span>
          </a>
        </span>
      </p>
    </aside>
  )
}
