import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSighting, createSighting, updateSighting } from '../services/api'
import SightingForm from './SightingForm'
import styles from './SightingFormPage.module.css'

export default function SightingFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getSighting(id)
      .then(data => setInitialValues(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  async function handleSubmit(data) {
    setIsSubmitting(true)
    setError(null)
    try {
      if (isEdit) {
        await updateSighting(id, data)
        navigate(`/sightings/${id}`)
      } else {
        const created = await createSighting(data)
        navigate(`/sightings/${created.id}`)
      }
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{isEdit ? 'Edit Sighting' : 'Log New Sighting'}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && (
        <SightingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  )
}
