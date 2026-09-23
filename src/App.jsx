import { useMemo, useRef, useState } from 'react'
import resources from './data/resources.json'
import FilterBar from './components/FilterBar.jsx'
import HelpBanner from './components/HelpBanner.jsx'
import ResourceList from './components/ResourceList.jsx'
import ResourceMap from './components/ResourceMap.jsx'
import { filterResources } from './lib/filterResources.js'
import { isWideScreen } from './lib/layout.js'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  // `source` records whether the list or the map made the selection,
  // so each side knows whether it needs to scroll or fly to catch up.
  const [selection, setSelection] = useState({ id: null, source: null })
  const mapPanelRef = useRef(null)
  const resultsRef = useRef(null)

  const matchingQuery = useMemo(() => filterResources(resources, { query }), [query])
  const visible = useMemo(
    () => filterResources(matchingQuery, { categories: selectedCategories }),
    [matchingQuery, selectedCategories],
  )
  const counts = useMemo(() => {
    const byCategory = {}
    for (const resource of matchingQuery) {
      byCategory[resource.category] = (byCategory[resource.category] ?? 0) + 1
    }
    return byCategory
  }, [matchingQuery])

  // New search results start at the top of the list, not wherever the old list was scrolled to.
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
        <h1>London Resource Map</h1>
        <p>Free and low-cost food, shelter, health and community services in London, Ontario.</p>
      </header>
      <HelpBanner />

      <main className="layout">
        <section className="filters" aria-label="Search and filters">
          <FilterBar
            query={query}
            onQueryChange={changeQuery}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            counts={counts}
            total={matchingQuery.length}
          />
        </section>

        <section className="map-panel" ref={mapPanelRef} aria-label="Map">
          <p className="visually-hidden">The map shows the same services as the list.</p>
          <ResourceMap
            resources={visible}
            selection={selection}
            onSelect={(id) => setSelection({ id, source: 'map' })}
          />
        </section>

        <section className="results" ref={resultsRef} aria-labelledby="results-heading">
          <h2 id="results-heading" className="visually-hidden">
            Services
          </h2>
          <p className="results-count" aria-live="polite">
            Showing {visible.length} of {resources.length} services
          </p>
          <ResourceList resources={visible} selection={selection} onSelect={selectFromList} />
          <p className="disclaimer">
            Details were checked on the dates shown, but hours and services change, so please call
            ahead. Some shelters keep their locations private for safety and aren’t on this map;
            call 211 to be connected. This is a student project and isn’t affiliated with the
            organizations listed.
          </p>
        </section>
      </main>
    </div>
  )
}
