import PropTypes from 'prop-types'
import SightingRow from './SightingRow'
import styles from './SightingTable.module.css'

export default function SightingTable({ sightings, onDelete }) {
  if (sightings.length === 0) {
    return <p className={styles.empty}>No sightings found.</p>
  }
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Species</th>
          <th>Location</th>
          <th>Observed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sightings.map(s => (
          <SightingRow key={s.id} sighting={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  )
}

SightingTable.propTypes = {
  sightings: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
}
