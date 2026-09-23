import { useEffect, useState } from 'react'
import { londonTime } from './hours.js'

// The current day and time in London, refreshed every minute so "Open now" stays accurate
// when the page is left open.
export function useLondonTime() {
  const [now, setNow] = useState(() => londonTime())

  useEffect(() => {
    const timer = setInterval(() => setNow(londonTime()), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  return now
}
