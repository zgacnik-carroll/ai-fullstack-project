import PropTypes from 'prop-types'
import styles from './FilterBar.module.css'

export default function FilterBar({ species, dateFrom, dateTo, speciesOptions, onFilterChange }) {
  return (
    <div className={styles.bar}>
      <label className={styles.field}>
        Species
        <select value={species} onChange={e => onFilterChange({ species: e.target.value })}>
          <option value="">All</option>
          {speciesOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        From
        <input type="date" value={dateFrom} onChange={e => onFilterChange({ dateFrom: e.target.value })} />
      </label>
      <label className={styles.field}>
        To
        <input type="date" value={dateTo} onChange={e => onFilterChange({ dateTo: e.target.value })} />
      </label>
      <button className={styles.clearBtn} onClick={() => onFilterChange({ species: '', dateFrom: '', dateTo: '' })}>
        Clear
      </button>
    </div>
  )
}

FilterBar.propTypes = {
  species: PropTypes.string.isRequired,
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string.isRequired,
  speciesOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired
}
