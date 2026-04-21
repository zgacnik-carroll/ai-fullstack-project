## API Spec

### Endpoints

**GET /api/sightings**
- Request: query params `species` (string, optional), `date_from` (string ISO8601, optional), `date_to` (string ISO8601, optional)
- Response 200: `{ "sightings": [ { "id": integer, "species": string, "location": string, "latitude": number, "longitude": number, "observed_at": string, "notes": string, "created_at": string } ] }`
- Error 500: internal server error

**GET /api/sightings/:id**
- Request: path param `id` (integer, required)
- Response 200: `{ "id": integer, "species": string, "location": string, "latitude": number, "longitude": number, "observed_at": string, "notes": string, "created_at": string }`
- Error 404: sighting not found
- Error 400: invalid id format

**POST /api/sightings**
- Request body: `{ "species": string (required), "location": string (required), "latitude": number (required), "longitude": number (required), "observed_at": string ISO8601 (required), "notes": string (optional) }`
- Response 201: `{ "id": integer, "species": string, "location": string, "latitude": number, "longitude": number, "observed_at": string, "notes": string, "created_at": string }`
- Error 400: missing required fields or invalid data

**PUT /api/sightings/:id**
- Request: path param `id` (integer, required); body: `{ "species": string (optional), "location": string (optional), "latitude": number (optional), "longitude": number (optional), "observed_at": string ISO8601 (optional), "notes": string (optional) }`
- Response 200: `{ "id": integer, "species": string, "location": string, "latitude": number, "longitude": number, "observed_at": string, "notes": string, "created_at": string }`
- Error 404: sighting not found
- Error 400: invalid id format or invalid field values

**DELETE /api/sightings/:id**
- Request: path param `id` (integer, required)
- Response 204: no body
- Error 404: sighting not found
- Error 400: invalid id format

**GET /api/species**
- Request: none
- Response 200: `{ "species": [ string ] }` — distinct species values from existing sightings, sorted alphabetically
- Error 500: internal server error

---

## DB Schema

### Table: sightings

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| species | TEXT | NOT NULL |
| location | TEXT | NOT NULL |
| latitude | REAL | NOT NULL |
| longitude | REAL | NOT NULL |
| observed_at | TEXT | NOT NULL — stored as ISO8601 string |
| notes | TEXT | DEFAULT '' |
| created_at | TEXT | NOT NULL DEFAULT (datetime('now')) |

No foreign keys — single-resource application with one user role and no auth.

---

## Component Tree

**App**
- Route: all routes (root wrapper)
- Props: none
- Data: none
- API calls: none
- Children: NavBar, SightingListPage, SightingDetailPage, SightingFormPage

---

**NavBar**
- Route: all routes
- Props: none
- Data: none — renders navigation links only
- API calls: none
- Children: none

---

**SightingListPage**
- Route: /
- Props: none
- Data: fetches all sightings, supports filter by species and date range
- API calls: GET /api/sightings, GET /api/species
- Children: FilterBar, SightingTable

---

**FilterBar**
- Route: / (child of SightingListPage)
- Props: `species: string, dateFrom: string, dateTo: string, speciesOptions: string[], onFilterChange: function`
- Data: receives species list from parent
- API calls: none (parent fetches GET /api/species)
- Children: none

---

**SightingTable**
- Route: / (child of SightingListPage)
- Props: `sightings: Sighting[], onDelete: function`
- Data: displays list of sightings with species, location, date columns
- API calls: DELETE /api/sightings/:id (via onDelete callback triggering parent refetch)
- Children: SightingRow

---

**SightingRow**
- Route: / (child of SightingTable)
- Props: `sighting: Sighting, onDelete: function`
- Data: renders one sighting row with link to detail and delete button
- API calls: none
- Children: none

---

**SightingDetailPage**
- Route: /sightings/:id
- Props: none (reads id from route params)
- Data: fetches single sighting by id
- API calls: GET /api/sightings/:id
- Children: SightingDetail

---

**SightingDetail**
- Route: /sightings/:id (child of SightingDetailPage)
- Props: `sighting: Sighting`
- Data: displays all fields of a single sighting including notes and coordinates
- API calls: none (parent fetches)
- Children: none

---

**SightingFormPage**
- Route: /sightings/new (create), /sightings/:id/edit (update)
- Props: none (reads id from route params when editing)
- Data: fetches existing sighting when editing; submits create or update
- API calls: GET /api/sightings/:id (edit mode only), POST /api/sightings (create), PUT /api/sightings/:id (edit)
- Children: SightingForm

---

**SightingForm**
- Route: /sightings/new and /sightings/:id/edit (child of SightingFormPage)
- Props: `initialValues: Partial<Sighting>, onSubmit: function, isSubmitting: boolean`
- Data: controlled form for species, location, latitude, longitude, observed_at, notes fields
- API calls: none (parent handles submission)
- Children: none
