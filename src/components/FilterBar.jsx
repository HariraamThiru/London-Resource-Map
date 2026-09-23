import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CATEGORIES } from '../lib/categories.js'

export default function FilterBar({
  query,
  onQueryChange,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  counts,
  total,
  openNow,
  onToggleOpenNow,
  locationStatus,
  onToggleNearMe,
}) {
  const { t } = useLanguage()
  const locationMessage = {
    locating: t.locating,
    on: t.sortedByDistance,
    denied: t.locationDenied,
    unavailable: t.locationUnavailable,
  }[locationStatus]

  return (
    <>
      <label className="search">
        <span className="search__label">{t.searchLabel}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.searchPlaceholder}
        />
      </label>

      <div className="chips" role="group" aria-label={t.categoryFilterLabel}>
        <button
          type="button"
          className="chip"
          aria-pressed={selectedCategories.length === 0}
          onClick={onClearCategories}
        >
          {t.all} <span className="chip__count">{total}</span>
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className="chip"
            style={{ '--chip-color': category.color }}
            aria-pressed={selectedCategories.includes(category.id)}
            onClick={() => onToggleCategory(category.id)}
          >
            <span className="chip__dot" aria-hidden="true" />
            {t.categories[category.id]} <span className="chip__count">{counts[category.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="toggles">
        <button type="button" className="toggle" aria-pressed={openNow} onClick={onToggleOpenNow}>
          {t.openNowFilter}
        </button>
        <button
          type="button"
          className="toggle"
          aria-pressed={locationStatus === 'on'}
          disabled={locationStatus === 'locating'}
          onClick={onToggleNearMe}
        >
          {t.nearMe}
        </button>
      </div>
      {/* Always rendered, so screen readers announce the message when it changes. */}
      <p className="location-message" role="status">
        {locationMessage}
      </p>
    </>
  )
}
