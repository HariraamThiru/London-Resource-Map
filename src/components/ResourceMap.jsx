import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CATEGORY_BY_ID } from '../lib/categories.js'
import OpenStatus from './OpenStatus.jsx'
import ResourceDetails from './ResourceDetails.jsx'

// When a service is picked from the list, fly the map to it and open its popup.
function FlyToSelection({ selection, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (selection.source !== 'list') return
    const marker = markerRefs.current.get(selection.id)
    if (!marker) return

    // Open the popup after the flight ends, so the popup's own panning doesn't cut the flight short.
    map.once('moveend', () => marker.openPopup())
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 15), { duration: 0.6 })
  }, [map, selection, markerRefs])

  return null
}

// When "Near me" turns on, zoom to show the visitor and their closest services together.
function FitToVisitor({ position, nearest }) {
  const map = useMap()
  // `nearest` is a new array on every render, so the effect watches the ids inside it.
  // Otherwise the map would jump back every minute when "Open now" refreshes.
  const nearestIds = nearest.map((resource) => resource.id).join()

  useEffect(() => {
    if (!position || nearest.length === 0) return
    map.flyToBounds(
      [[position.lat, position.lng], ...nearest.map((resource) => [resource.lat, resource.lng])],
      { padding: [40, 40], maxZoom: 15, duration: 0.8 },
    )
  }, [map, position, nearestIds])

  return null
}

export default function ResourceMap({
  resources,
  selection,
  onSelect,
  now,
  visitorPosition,
  nearestToVisitor,
}) {
  const { t } = useLanguage()
  const markerRefs = useRef(new Map())
  // Start zoomed to fit every service. Later filtering doesn't move the map.
  const [initialBounds] = useState(() => resources.map((resource) => [resource.lat, resource.lng]))

  return (
    <MapContainer
      className="map"
      bounds={initialBounds}
      boundsOptions={{ padding: [30, 30] }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {resources.map((resource) => {
        const category = CATEGORY_BY_ID[resource.category]

        return (
          <CircleMarker
            key={resource.id}
            ref={(marker) => {
              markerRefs.current.set(resource.id, marker)
              return () => markerRefs.current.delete(resource.id)
            }}
            center={[resource.lat, resource.lng]}
            radius={9}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: category.color, fillOpacity: 0.95 }}
            eventHandlers={{ click: () => onSelect(resource.id) }}
          >
            {/* Extra top-left padding keeps popups clear of the zoom buttons. */}
            <Popup autoPanPaddingTopLeft={[50, 12]}>
              <strong className="popup__title">{resource.name}</strong>
              <span className="popup__meta">
                {t.categories[resource.category]}
                <OpenStatus hours={resource.hours} now={now} />
              </span>
              <ResourceDetails resource={resource} />
            </Popup>
          </CircleMarker>
        )
      })}
      {visitorPosition && (
        <CircleMarker
          center={[visitorPosition.lat, visitorPosition.lng]}
          radius={8}
          pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#111827', fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -10]} permanent>
            {t.youAreHere}
          </Tooltip>
        </CircleMarker>
      )}
      <FlyToSelection selection={selection} markerRefs={markerRefs} />
      <FitToVisitor position={visitorPosition} nearest={nearestToVisitor} />
    </MapContainer>
  )
}
