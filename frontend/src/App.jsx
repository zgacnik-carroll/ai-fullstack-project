import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import SightingListPage from './components/SightingListPage'
import SightingDetailPage from './components/SightingDetailPage'
import SightingFormPage from './components/SightingFormPage'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<SightingListPage />} />
        <Route path="/sightings/new" element={<SightingFormPage />} />
        <Route path="/sightings/:id" element={<SightingDetailPage />} />
        <Route path="/sightings/:id/edit" element={<SightingFormPage />} />
      </Routes>
    </>
  )
}
