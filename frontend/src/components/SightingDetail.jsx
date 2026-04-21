import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './SightingDetail.module.css'

export default function SightingDetail({ sighting }) {
  return (
    <div className={styles.card}>
      <dl className={styles.dl}>
        <dt>Species</dt>
        <dd>{sighting.species}</dd>
        <dt>Location</dt>
        <dd>{sighting.location}</dd>
        <dt>Coordinates</dt>
        <dd>{sighting.latitude}, {sighting.longitude}</dd>
        <dt>Observed</dt>
        <dd>{new Date(sighting.observed_at).toLocaleString()}</dd>
        <dt>Notes</dt>
        <dd>{sighting.notes || '—'}</dd>
        <dt>Logged</dt>
        <dd>{new Date(sighting.created_at).toLocaleString()}</dd>
      </dl>
      <div className={styles.actions}>
        <Link to={`/sightings/${sighting.id}/edit`} className={styles.editBtn}>Edit</Link>
        <Link to="/">Back to list</Link>
      </div>
    </div>
  )
}

SightingDetail.propTypes = {
  sighting: PropTypes.shape({
    id: PropTypes.number.isRequired,
    species: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    observed_at: PropTypes.string.isRequired,
    notes: PropTypes.string,
    created_at: PropTypes.string.isRequired
  }).isRequired
}
