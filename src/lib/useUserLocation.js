import { useState } from 'react'

// Asks the browser for the visitor's location, only after they click "Near me".
// The position is kept in this page's memory and never sent anywhere.
export function useUserLocation() {
  // off | locating | on | denied | unavailable
  const [status, setStatus] = useState('off')
  const [position, setPosition] = useState(null)

  function turnOn() {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude })
        setStatus('on')
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { timeout: 10 * 1000, maximumAge: 5 * 60 * 1000 },
    )
  }

  function turnOff() {
    setPosition(null)
    setStatus('off')
  }

  return { status, position, turnOn, turnOff }
}
