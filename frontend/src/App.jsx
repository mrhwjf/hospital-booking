import { useMemo, useState } from "react";
import DoctorLayout from "./components/layout/DoctorLayout/index";
import PhieuChiDinhPage from "./features/clinical/pages/PhieuChiDinhPage";
import PhieuKhamPage from "./features/clinical/pages/PhieuKhamPage";
import HoSoTaiLieuPage from "./features/records/pages/HoSoTaiLieuPage";
import LichSuKhamPage from "./features/clinical/pages/LichSuKhamPage";


import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DonThuocPage from "./features/clinical/pages/DonThuocPage";
import DsPhieuKham from "./features/clinical/pages/DsPhieuKham";
import ThongTinBS from "./features/clinical/pages/ThongTinBS";
import DoctorLayout from "./components/layout/DoctorLayout";

function App() {
  const [activeMenu, setActiveMenu] = useState("ho-so");

  const menuItems = useMemo(
    () => [
      { key: "phieu-kham", label: "Phiếu khám" },
      { key: "chi-dinh", label: "Phiếu chỉ định" },
      { key: "ho-so", label: "Hồ sơ tài liệu" },
      { key: "lich-su", label: "Lịch sử khám" },
    ],
    []
  );

  const pageContent = useMemo(() => {
    switch (activeMenu) {
      case "phieu-kham":
        return <PhieuKhamPage />;
      case "chi-dinh":
        return <PhieuChiDinhPage />;
      case "lich-su":
        return <LichSuKhamPage />;
      case "ho-so":
      default:
        return <HoSoTaiLieuPage />;
    }
  }, [activeMenu]);

  return (
    <DoctorLayout
      activeKey={activeMenu}
      onMenuChange={setActiveMenu}
      menuItems={menuItems}
      doctorName="BS. Trần Văn B"
    >
      {pageContent}
    </DoctorLayout>
  );
}

// const AccountSettingsPlaceholder = () => (
//   <div className="space-y-3">
//     <h2 className="text-2xl font-semibold text-slate-900">Thông tin tài khoản</h2>
//     <p className="text-slate-600">
//       Tính năng đang được phát triển. Vui lòng quay lại sau.
//     </p>
//   </div>
// );

// const LogoutPlaceholder = () => (
//   <div className="space-y-3">
//     <h2 className="text-2xl font-semibold text-slate-900">Đăng xuất</h2>
//     <p className="text-slate-600">Bạn đã đăng xuất khỏi hệ thống.</p>
//   </div>
// );

// function App() {
//   return (
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/doctor/appointments" replace />} />
//           <Route path="/doctor" element={<DoctorLayout doctorName="Nguyễn Văn A" />}>
//             <Route index element={<Navigate to="appointments" replace />} />
//             <Route path="appointments" element={<DsPhieuKham />} />
//             <Route path="profile" element={<ThongTinBS />} />
//             <Route path="account" element={<AccountSettingsPlaceholder />} />  {/* chưa gắn*/}
//           </Route>
//           <Route path="/logout" element={<LogoutPlaceholder />} />    {/* chưa gắn*/} 
         
//         </Routes>
//       </BrowserRouter>
//   );
// }

export default App;
