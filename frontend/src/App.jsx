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
import LandingPage from "./components/layout/LandingPage";
import LoginPage from "./components/layout/LoginPage";
import Profile from "./components/layout/Profile";
import RegisterPage from "./components/layout/RegisterPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
