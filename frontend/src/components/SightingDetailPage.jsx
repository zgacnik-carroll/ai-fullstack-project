import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSighting } from '../services/api'
import SightingDetail from './SightingDetail'
import styles from './SightingDetailPage.module.css'

export default function SightingDetailPage() {
  const { id } = useParams()
  const [sighting, setSighting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSighting(id)
      .then(data => setSighting(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Sighting Detail</h1>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {sighting && <SightingDetail sighting={sighting} />}
    </main>
  )
}
