import AppProviders from './app/providers'
import AppRouter from './app/router'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

// CONTENT WILL BE USED IN FUTURE FOR FOR POST-MERGE REFACTORING

// import { Route, Routes } from "react-router-dom";
// import PatientLayout from "./components/layout/PatientLayout";
// import PatientProfilePage from "./features/patients/pages/PatientProfilePage";
// import ExploreServicesPage from "./features/services/pages/ExploreServicesPage";
// import ServiceDetailPage from "./features/services/pages/ServiceDetailPage";
// import BookingPage from "./features/services/pages/BookingPage";
// import ExplorePage from "./features/explore/pages/ExplorePage";
// import DoctorDetailPage from "./features/explore/pages/DoctorDetailPage";
// import LandingPage from "./components/layout/LandingPage";
// import LoginPage from "./components/layout/LoginPage";
// import AccountProfile from "./components/layout/AccountProfile";
// import RegisterPage from "./components/layout/RegisterPage";
// import Tongquan from "./features/patients/pages/Tongquan";

// function App() {
//   return (
//     <Routes>
//       {/* Public Routes - Không có layout */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       {/* Protected Routes - Với PatientLayout */}
//       <Route element={<PatientLayout />}>
//         <Route path="/explore" element={<ExplorePage />} />
//         <Route path="/doctors/:id" element={<DoctorDetailPage />} />
//         <Route path="/services" element={<ExploreServicesPage />} />
//         <Route path="/services/:id" element={<ServiceDetailPage />} />
//         <Route path="/booking" element={<BookingPage />} />
//         <Route path="/patient/profile" element={<PatientProfilePage />} />
//         <Route path="/patient/account" element={<AccountProfile />} />
//         <Route path="/patient/dashboard" element={<Tongquan />} />
//       </Route>
//     </Routes>
//   );
// }