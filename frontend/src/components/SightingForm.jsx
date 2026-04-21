import PropTypes from 'prop-types'
import styles from './SightingForm.module.css'

export default function SightingForm({ initialValues, onSubmit, isSubmitting }) {
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    onSubmit({
      species: form.species.value.trim(),
      location: form.location.value.trim(),
      latitude: parseFloat(form.latitude.value),
      longitude: parseFloat(form.longitude.value),
      observed_at: new Date(form.observed_at.value).toISOString(),
      notes: form.notes.value.trim()
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Species *
        <input name="species" required defaultValue={initialValues.species || ''} />
      </label>
      <label className={styles.field}>
        Location *
        <input name="location" required defaultValue={initialValues.location || ''} />
      </label>
      <label className={styles.field}>
        Latitude *
        <input name="latitude" type="number" step="any" required defaultValue={initialValues.latitude ?? ''} />
      </label>
      <label className={styles.field}>
        Longitude *
        <input name="longitude" type="number" step="any" required defaultValue={initialValues.longitude ?? ''} />
      </label>
      <label className={styles.field}>
        Observed At *
        <input
          name="observed_at"
          type="datetime-local"
          required
          defaultValue={initialValues.observed_at
            ? new Date(initialValues.observed_at).toISOString().slice(0, 16)
            : ''}
        />
      </label>
      <label className={styles.field}>
        Notes
        <textarea name="notes" rows={3} defaultValue={initialValues.notes || ''} />
      </label>
      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}

SightingForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired
}
