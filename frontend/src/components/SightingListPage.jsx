import { useState, useEffect } from 'react'
import { getSightings, getSpecies, deleteSighting } from '../services/api'
import FilterBar from './FilterBar'
import SightingTable from './SightingTable'
import styles from './SightingListPage.module.css'

export default function SightingListPage() {
  const [sightings, setSightings] = useState([])
  const [speciesOptions, setSpeciesOptions] = useState([])
  const [filters, setFilters] = useState({ species: '', dateFrom: '', dateTo: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSpecies()
      .then(data => setSpeciesOptions(data.species))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getSightings({ species: filters.species, dateFrom: filters.dateFrom, dateTo: filters.dateTo })
      .then(data => setSightings(data.sightings))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [filters])

  function handleFilterChange(patch) {
    setFilters(prev => ({ ...prev, ...patch }))
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this sighting?')) return
    try {
      await deleteSighting(id)
      setSightings(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Wildlife Sightings</h1>
      <FilterBar
        species={filters.species}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        speciesOptions={speciesOptions}
        onFilterChange={handleFilterChange}
      />
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && !error && <SightingTable sightings={sightings} onDelete={handleDelete} />}
    </main>
  )
}
