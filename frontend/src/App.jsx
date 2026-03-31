import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DonThuocPage from "./features/clinical/pages/DonThuocPage";
import DsPhieuKham from "./features/clinical/pages/DsPhieuKham";
import ThongTinBS from "./features/clinical/pages/ThongTinBS";
import DoctorLayout from "./components/layout/DoctorLayout";

const AccountSettingsPlaceholder = () => (
  <div className="space-y-3">
    <h2 className="text-2xl font-semibold text-slate-900">Thông tin tài khoản</h2>
    <p className="text-slate-600">
      Tính năng đang được phát triển. Vui lòng quay lại sau.
    </p>
  </div>
);

const LogoutPlaceholder = () => (
  <div className="space-y-3">
    <h2 className="text-2xl font-semibold text-slate-900">Đăng xuất</h2>
    <p className="text-slate-600">Bạn đã đăng xuất khỏi hệ thống.</p>
  </div>
);

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/doctor/appointments" replace />} />
          <Route path="/doctor" element={<DoctorLayout doctorName="Nguyễn Văn A" />}>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="appointments" element={<DsPhieuKham />} />
            <Route path="profile" element={<ThongTinBS />} />
            <Route path="account" element={<AccountSettingsPlaceholder />} />  {/* chưa gắn*/}
          </Route>
          <Route path="/logout" element={<LogoutPlaceholder />} />    {/* chưa gắn*/} 
         
        </Routes>
      </BrowserRouter>
  );
}

export default App;
