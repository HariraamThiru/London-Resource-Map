import { directionsUrl, formatDate, phoneHref } from '../lib/links.js'

function NewTabNote({ name }) {
  return <span className="visually-hidden"> for {name} (opens in a new tab)</span>
}

// The address, hours and links for one service. Used in both the list and the map popups.
export default function ResourceDetails({ resource }) {
  return (
    <>
      <dl className="details">
        {resource.eligibility && (
          <>
            <dt>For</dt>
            <dd>{resource.eligibility}</dd>
          </>
        )}
        <dt>Address</dt>
        <dd>{resource.address}</dd>
        {resource.hours && (
          <>
            <dt>Hours</dt>
            <dd>{resource.hours}</dd>
          </>
        )}
        {resource.phone && (
          <>
            <dt>Phone</dt>
            <dd>
              <a href={phoneHref(resource.phone)}>{resource.phone}</a>
            </dd>
          </>
        )}
      </dl>
      <p className="details__links">
        {resource.website && (
          <a href={resource.website} target="_blank" rel="noreferrer">
            Website
            <NewTabNote name={resource.name} />
          </a>
        )}
        <a href={directionsUrl(resource.address)} target="_blank" rel="noreferrer">
          Directions
          <NewTabNote name={resource.name} />
        </a>
      </p>
      <p className="details__meta">
        <a href={resource.source} target="_blank" rel="noreferrer">
          Source
          <NewTabNote name={resource.name} />
        </a>{' '}
        checked {formatDate(resource.lastChecked)}
      </p>
    </>
  )
}
