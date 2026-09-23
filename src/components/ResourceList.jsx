import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CATEGORY_BY_ID } from '../lib/categories.js'
import { formatDistance } from '../lib/format.js'
import { isWideScreen } from '../lib/layout.js'
import OpenStatus from './OpenStatus.jsx'
import ResourceDetails from './ResourceDetails.jsx'

export default function ResourceList({ resources, selection, onSelect, now, distances, emptyMessage }) {
  const { locale, t, localize } = useLanguage()
  const cardRefs = useRef(new Map())

  // When someone clicks a marker, bring its card into view. Only on wide screens:
  // on phones the list sits below the map, and scrolling would hide the popup.
  useEffect(() => {
    if (selection.source === 'map' && isWideScreen()) {
      cardRefs.current.get(selection.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selection])

  if (resources.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <ul className="resource-list">
      {resources.map((resource) => {
        const category = CATEGORY_BY_ID[resource.category]
        const isSelected = resource.id === selection.id

        return (
          <li
            key={resource.id}
            ref={(card) => {
              cardRefs.current.set(resource.id, card)
              return () => cardRefs.current.delete(resource.id)
            }}
            className={isSelected ? 'card card--selected' : 'card'}
          >
            <div className="card__meta">
              <span className="badge" style={{ '--badge-color': category.color }}>
                {t.categories[resource.category]}
              </span>
              <OpenStatus hours={resource.hours} now={now} />
              {distances && (
                <span className="distance">
                  {t.distanceAway(formatDistance(distances.get(resource.id), locale))}
                </span>
              )}
            </div>
            <h3 className="card__title">
              <button type="button" onClick={() => onSelect(resource.id)}>
                {resource.name}
                <span className="visually-hidden"> {t.showOnMap}</span>
              </button>
            </h3>
            <p className="card__description">{localize(resource.description)}</p>
            <ResourceDetails resource={resource} />
          </li>
        )
      })}
    </ul>
  )
}
