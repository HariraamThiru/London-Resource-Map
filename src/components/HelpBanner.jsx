export default function HelpBanner() {
  return (
    <aside className="help-banner" aria-label="Urgent help">
      <p>
        <span>
          <strong>Emergency:</strong> call <a href="tel:911">911</a>
        </span>
        <span>
          <strong>Crisis support:</strong> call or text <a href="tel:988">988</a>
        </span>
        <span>
          <strong>Other services:</strong> call <a href="tel:211">211</a> or visit{' '}
          <a href="https://211ontario.ca" target="_blank" rel="noreferrer">
            211ontario.ca<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </span>
      </p>
    </aside>
  )
}
