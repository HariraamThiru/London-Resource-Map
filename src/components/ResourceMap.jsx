import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { CATEGORY_BY_ID } from '../lib/categories.js'
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

export default function ResourceMap({ resources, selection, onSelect }) {
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
              <span className="popup__category">{category.label}</span>
              <ResourceDetails resource={resource} />
            </Popup>
          </CircleMarker>
        )
      })}
      <FlyToSelection selection={selection} markerRefs={markerRefs} />
    </MapContainer>
  )
}
