import { Navigate, Route, Routes } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import ExploreServicesPage from '../services/pages/ExploreServicesPage'
import ServiceDetailPage from '../services/pages/ServiceDetailPage'

function Khamphachuyenmon() {
	return (
		<Routes>
			<Route index element={<Navigate replace to="services" />} />
			<Route path="services" element={<ExploreServicesPage />} />
			<Route path="services/:id" element={<ServiceDetailPage />} />
			<Route path="explore" element={<ExplorePage />} />
			<Route path="doctors/:id" element={<DoctorDetailPage />} />
			<Route path="*" element={<Navigate replace to="services" />} />
		</Routes>
	)
}

export default Khamphachuyenmon
