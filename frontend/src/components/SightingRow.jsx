import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './SightingRow.module.css'

export default function SightingRow({ sighting, onDelete }) {
  return (
    <tr className={styles.row}>
      <td>{sighting.species}</td>
      <td>{sighting.location}</td>
      <td>{new Date(sighting.observed_at).toLocaleDateString()}</td>
      <td className={styles.actions}>
        <Link to={`/sightings/${sighting.id}`}>View</Link>
        <Link to={`/sightings/${sighting.id}/edit`}>Edit</Link>
        <button className={styles.deleteBtn} onClick={() => onDelete(sighting.id)}>Delete</button>
      </td>
    </tr>
  )
}

SightingRow.propTypes = {
  sighting: PropTypes.shape({
    id: PropTypes.number.isRequired,
    species: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    observed_at: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
}
