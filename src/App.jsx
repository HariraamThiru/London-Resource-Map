import { useMemo, useRef, useState } from 'react'
import resources from './data/resources.json'
import FilterBar from './components/FilterBar.jsx'
import HelpBanner from './components/HelpBanner.jsx'
import LanguageToggle from './components/LanguageToggle.jsx'
import ResourceList from './components/ResourceList.jsx'
import ResourceMap from './components/ResourceMap.jsx'
import { useLanguage } from './i18n/LanguageContext.jsx'
import { distanceKm } from './lib/distance.js'
import { filterResources } from './lib/filterResources.js'
import { isWideScreen } from './lib/layout.js'
import { suggestServiceUrl } from './lib/links.js'
import { useLondonTime } from './lib/useLondonTime.js'
import { useUserLocation } from './lib/useUserLocation.js'

// "Near me" only zooms the map to services within this distance, so a visitor
// in another city isn't shown an empty stretch of map.
const NEARBY_KM = 50

export default function App() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [openNow, setOpenNow] = useState(false)
  // `source` records whether the list or the map made the selection,
  // so each side knows whether it needs to scroll or fly to catch up.
  const [selection, setSelection] = useState({ id: null, source: null })
  const now = useLondonTime()
  const location = useUserLocation()
  const mapPanelRef = useRef(null)
  const resultsRef = useRef(null)

  // Search and "Open now" are applied first, so the category counts include them.
  const matching = useMemo(
    () => filterResources(resources, { query, openAt: openNow ? now : null }),
    [query, openNow, now],
  )
  const visible = useMemo(
    () => filterResources(matching, { categories: selectedCategories }),
    [matching, selectedCategories],
  )
  const counts = useMemo(() => {
    const byCategory = {}
    for (const resource of matching) {
      byCategory[resource.category] = (byCategory[resource.category] ?? 0) + 1
    }
    return byCategory
  }, [matching])

  // With "Near me" on, the list is sorted by distance from the visitor.
  const distances = useMemo(
    () =>
      location.position &&
      new Map(resources.map((resource) => [resource.id, distanceKm(location.position, resource)])),
    [location.position],
  )
  const ordered = useMemo(
    () => (distances ? [...visible].sort((a, b) => distances.get(a.id) - distances.get(b.id)) : visible),
    [visible, distances],
  )
  const nearest = useMemo(
    () =>
      distances
        ? ordered.filter((resource) => distances.get(resource.id) <= NEARBY_KM).slice(0, 3)
        : [],
    [ordered, distances],
  )

  // New results start at the top of the list, not wherever the old list was scrolled to.
  function scrollResultsToTop() {
    resultsRef.current?.scrollTo({ top: 0 })
  }

  function changeQuery(text) {
    setQuery(text)
    scrollResultsToTop()
  }

  function toggleCategory(id) {
    setSelectedCategories((current) =>
      current.includes(id) ? current.filter((category) => category !== id) : [...current, id],
    )
    scrollResultsToTop()
  }

  function clearCategories() {
    setSelectedCategories([])
    scrollResultsToTop()
  }

  function toggleOpenNow() {
    setOpenNow((current) => !current)
    scrollResultsToTop()
  }

  function toggleNearMe() {
    if (location.status === 'on') {
      location.turnOff()
    } else {
      location.turnOn()
    }
    scrollResultsToTop()
  }

  function selectFromList(id) {
    setSelection({ id, source: 'list' })
    // On phones the map is above the list, so scroll up to show where the service is.
    if (!isWideScreen()) {
      mapPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <LanguageToggle />
      </header>
      <HelpBanner />

      <main className="layout">
        <section className="filters" aria-label={t.filtersLabel}>
          <FilterBar
            query={query}
            onQueryChange={changeQuery}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            counts={counts}
            total={matching.length}
            openNow={openNow}
            onToggleOpenNow={toggleOpenNow}
            locationStatus={location.status}
            onToggleNearMe={toggleNearMe}
          />
        </section>

        <section className="map-panel" ref={mapPanelRef} aria-label={t.mapLabel}>
          <p className="visually-hidden">{t.mapNote}</p>
          <ResourceMap
            resources={visible}
            selection={selection}
            onSelect={(id) => setSelection({ id, source: 'map' })}
            now={now}
            visitorPosition={location.position}
            nearestToVisitor={nearest}
          />
        </section>

        <section className="results" ref={resultsRef} aria-labelledby="results-heading">
          <h2 id="results-heading" className="visually-hidden">
            {t.servicesHeading}
          </h2>
          <p className="results-count" aria-live="polite">
            {t.resultsCount(visible.length, resources.length)}
          </p>
          <ResourceList
            resources={ordered}
            selection={selection}
            onSelect={selectFromList}
            now={now}
            distances={distances}
            emptyMessage={openNow ? t.noneOpen : t.noMatches}
          />
          <p className="disclaimer">{t.disclaimer}</p>
          <p className="disclaimer">
            {t.suggestService}{' '}
            <a href={suggestServiceUrl()} target="_blank" rel="noreferrer">
              {t.suggestServiceLink}
              <span className="visually-hidden">{t.newTabGeneric}</span>
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
