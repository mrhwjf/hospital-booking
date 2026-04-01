import { Routes, Route, Navigate } from 'react-router-dom'
import PatientLayout from './components/layout/PatientLayout'
import PatientProfilePage from './features/patients/pages/PatientProfilePage'
import ExploreServicesPage from './features/services/pages/ExploreServicesPage'
import ServiceDetailPage from './features/services/pages/ServiceDetailPage'
import BookingPage from './features/services/pages/BookingPage'
import ExplorePage from './features/explore/pages/ExplorePage'
import DoctorDetailPage from './features/explore/pages/DoctorDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<PatientLayout />} path="/">
        <Route element={<Navigate replace to="/explore" />} index />
        <Route element={<ExplorePage />} path="explore" />
        <Route element={<DoctorDetailPage />} path="doctors/:id" />
        <Route element={<ExploreServicesPage />} path="services" />
        <Route element={<ServiceDetailPage />} path="services/:id" />
        <Route element={<BookingPage />} path="booking" />
        <Route element={<PatientProfilePage />} path="patient/profile" />
      </Route>
    </Routes>
  )
}

export default App