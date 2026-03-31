import { useMemo, useState } from "react";
import DoctorLayout from "./components/layout/DoctorLayout/index";
import PhieuChiDinhPage from "./features/clinical/pages/PhieuChiDinhPage";
import PhieuKhamPage from "./features/clinical/pages/PhieuKhamPage";
import HoSoTaiLieuPage from "./features/records/pages/HoSoTaiLieuPage";
import LichSuKhamPage from "./features/clinical/pages/LichSuKhamPage";

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

export default App;