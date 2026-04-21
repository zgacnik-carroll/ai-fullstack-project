const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status}: ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// GET /api/sightings — list sightings, optional filters: species, date_from, date_to
export async function getSightings({ species, dateFrom, dateTo } = {}) {
  const params = new URLSearchParams()
  if (species) params.set('species', species)
  if (dateFrom) params.set('date_from', dateFrom)
  if (dateTo) params.set('date_to', dateTo)
  const query = params.toString() ? `?${params}` : ''
  return handleResponse(await fetch(`${BASE}/sightings${query}`))
}

// GET /api/sightings/:id — fetch a single sighting by id
export async function getSighting(id) {
  return handleResponse(await fetch(`${BASE}/sightings/${id}`))
}

// POST /api/sightings — creates a new sighting, returns the created object
export async function createSighting(data) {
  return handleResponse(await fetch(`${BASE}/sightings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }))
}

// PUT /api/sightings/:id — updates an existing sighting, returns updated object
export async function updateSighting(id, data) {
  return handleResponse(await fetch(`${BASE}/sightings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }))
}

// DELETE /api/sightings/:id — deletes a sighting, returns null on success
export async function deleteSighting(id) {
  return handleResponse(await fetch(`${BASE}/sightings/${id}`, {
    method: 'DELETE'
  }))
}

// GET /api/species — returns distinct species list sorted alphabetically
export async function getSpecies() {
  return handleResponse(await fetch(`${BASE}/species`))
}
