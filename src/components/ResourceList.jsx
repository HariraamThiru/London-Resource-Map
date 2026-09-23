import { useEffect, useRef } from 'react'
import { CATEGORY_BY_ID } from '../lib/categories.js'
import { isWideScreen } from '../lib/layout.js'
import ResourceDetails from './ResourceDetails.jsx'

export default function ResourceList({ resources, selection, onSelect }) {
  const cardRefs = useRef(new Map())

  // When someone clicks a marker, bring its card into view. Only on wide screens:
  // on phones the list sits below the map, and scrolling would hide the popup.
  useEffect(() => {
    if (selection.source === 'map' && isWideScreen()) {
      cardRefs.current.get(selection.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selection])

  if (resources.length === 0) {
    return <p className="empty">No services match. Try a different word or category.</p>
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
            <span className="badge" style={{ '--badge-color': category.color }}>
              {category.label}
            </span>
            <h3 className="card__title">
              <button type="button" onClick={() => onSelect(resource.id)}>
                {resource.name}
                <span className="visually-hidden"> (show on map)</span>
              </button>
            </h3>
            <p className="card__description">{resource.description}</p>
            <ResourceDetails resource={resource} />
          </li>
        )
      })}
    </ul>
  )
}
