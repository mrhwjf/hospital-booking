import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";
import DoctorFooter from "./DoctorFooter";

const DEFAULT_MENU = [
  { key: "phieu-kham", label: "Phiếu khám" },
  { key: "chi-dinh", label: "Phiếu chỉ định" },
  { key: "ho-so", label: "Hồ sơ tài liệu" },
  { key: "lich-su", label: "Lịch sử khám" },
];

export default function DoctorLayout({
  activeKey,
  onMenuChange,
  menuItems = DEFAULT_MENU,
  doctorName = "Bác sĩ",
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DoctorHeader doctorName={doctorName} />

      <div className="mx-auto grid min-h-[calc(100vh-6.75rem)] max-w-[1600px] grid-cols-12 gap-0">
        <DoctorSidebar activeKey={activeKey} onMenuChange={onMenuChange} menuItems={menuItems} />
        <main className="col-span-12 p-4 md:col-span-9 md:p-6 lg:col-span-10">{children}</main>
      </div>

      <DoctorFooter />
    </div>
  );
}
