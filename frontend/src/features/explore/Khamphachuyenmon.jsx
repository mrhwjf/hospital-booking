import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import ExploreServicesPage from '../services/pages/ExploreServicesPage'
import ServiceDetailPage from '../services/pages/ServiceDetailPage'
import BookingPage from '../services/pages/BookingPage'
import Tongquan from '../patients/pages/Tongquan'

function Khamphachuyenmon() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Navigate replace to="/services" />} path="/" />
				<Route element={<ExploreServicesPage />} path="/services" />
				<Route element={<ServiceDetailPage />} path="/services/:id" />
				<Route element={<BookingPage />} path="/booking" />
				<Route element={<ExplorePage />} path="/explore" />
				<Route element={<DoctorDetailPage />} path="/doctors/:id" />
				<Route element={<Tongquan />} path="/tongquan" />
			</Routes>
		</BrowserRouter>
	)
}

export default Khamphachuyenmon
