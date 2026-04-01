// import { useState } from 'react'
// import { ConfigProvider } from 'antd'

// import LichHenCuaToiPage from './features/scheduling/pages/patients/LichHenCuaToiPage'
// import DatLichPage from './features/scheduling/pages/patients/DatLichPage'
// import LeTanQuanLyLichHenPage from './features/scheduling/pages/receptionist/LeTanQuanLyLichHenPage'
// import AdminDoctorScheduleModulePage from './features/admin/pages/doctor-schedule/AdminDoctorScheduleModulePage'
// import LichSuKhamPage from './features/patients/pages/lich-su-kham/LichSuKhamPage'
// import StaffProfilePage from './features/clinical/pages/StaffProfilePage'
// import StaffLayout from './components/layout/StaffLayout'

// const MODULE_OPTIONS = [
//   { label: 'Đặt lịch', value: 'dat-lich' },
//   { label: 'Lịch hẹn của tôi', value: 'lich-cua-toi' },
//   { label: 'Lịch sử khám', value: 'lich-su-kham' },
//   { label: 'Hồ sơ nhân viên', value: 'ho-so-nhan-vien' },
//   { label: 'Lễ tân quản lý', value: 'le-tan' },
//   { label: 'Admin lịch bác sĩ', value: 'admin-lich-bac-si' },
//   { label: 'Đăng xuất', value: 'logout' },
// ]

// function App() {
//   const [view, setView] = useState('dat-lich')

//   const renderActiveView = () => {
//     switch (view) {
//       case 'dat-lich':
//         return <DatLichPage />
//       case 'lich-cua-toi':
//         return <LichHenCuaToiPage />
//       case 'lich-su-kham':
//         return <LichSuKhamPage />
//       case 'ho-so-nhan-vien':
//         return <StaffProfilePage />
//       case 'le-tan':
//         return <LeTanQuanLyLichHenPage />
//       case 'admin-lich-bac-si':
//         return <AdminDoctorScheduleModulePage />
//       case 'logout':
//         return null;
//       default:
//         return <DatLichPage />
//     }
//   }

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: '#0F766E',
//           colorInfo: '#2563EB',
//           colorSuccess: '#16A34A',
//           colorWarning: '#F59E0B',
//           colorError: '#DC2626',
//           colorTextBase: '#0F172A',
//           colorBorder: '#E2E8F0',
//           colorBgLayout: '#F8FAFC',
//         },
//       }}
//     >
//       <StaffLayout
//         menuItems={MODULE_OPTIONS}
//         activeKey={view}
//         onMenuChange={setView}
//         staffName="Lê Thị Thu"
//       >
//         {renderActiveView()}
//       </StaffLayout>
//     </ConfigProvider>
//   )
// }

// export default App
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, Button, Tabs, message } from "antd";
// import DoctorLayout from "./components/layout/DoctorLayOut";
// import ThongTinBS from "./features/clinical/pages/ThongTinBS";
// import QuanLyBenhNhanPage from "./features/clinical/pages/QuanLyBenhNhanPage";
// import LichSuKhamPage from "./features/clinical/pages/LichSuKhamPage";
// import PhieuKhamPage from "./features/clinical/pages/PhieuKhamPage";
// import PhieuChiDinhPage from "./features/clinical/pages/PhieuChiDinhPage";
// import DonThuocPage from "./features/clinical/pages/DonThuocPage";
// import HoSoTaiLieuPage from "./features/records/pages/HoSoTaiLieuPage";
// import { completePhieuKham } from "./Services/clinicalService";

// const MENU_ITEMS = [
//   { key: "thong-tin", label: "Thông tin bác sĩ" },
//   { key: "quan-ly-benh-nhan", label: "Quản lý bệnh nhân" },
// ];

// export default function App() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [activeMenu, setActiveMenu] = useState("thong-tin");
//   const [selectedDoctorId, setSelectedDoctorId] = useState(1);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [selectedPhieuKham, setSelectedPhieuKham] = useState(null);
//   const [activeExamTab, setActiveExamTab] = useState("phieu-kham");
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [finishing, setFinishing] = useState(false);

//   const isExamLocked = selectedPhieuKham?.trang_thai === "hoan_thanh";

//   const doctorName = useMemo(() => {
//     if (!selectedDoctorId) {
//       return "Bác sĩ";
//     }
//     return `Bác sĩ #${selectedDoctorId}`;
//   }, [selectedDoctorId]);

//   useEffect(() => {
//     setSelectedPatient(null);
//     setSelectedPhieuKham(null);
//     setActiveExamTab("phieu-kham");
//   }, [selectedDoctorId]);

//   async function handleFinishExam() {
//     if (!selectedPhieuKham?.id || isExamLocked) {
//       return;
//     }

//     setFinishing(true);

//     try {
//       const updated = await completePhieuKham(selectedPhieuKham.id);
//       setSelectedPhieuKham(updated);
//       setRefreshKey((prev) => prev + 1);
//       await messageApi.success("Khám bệnh hoàn tất");

//       setActiveMenu("quan-ly-benh-nhan");
//       setSelectedPatient(null);
//       setSelectedPhieuKham(null);
//       setActiveExamTab("phieu-kham");
//     } catch (error) {
//       await messageApi.error(error?.response?.data?.message || "Không thể hoàn tất khám bệnh.");
//     } finally {
//       setFinishing(false);
//     }
//   }

//   const examTabs = [
//     {
//       key: "phieu-kham",
//       label: "Phiếu khám",
//       children: (
//         <PhieuKhamPage
//           phieuKhamId={selectedPhieuKham?.id}
//           refreshKey={refreshKey}
//           onPhieuKhamChange={(updated) => setSelectedPhieuKham(updated)}
//         />
//       ),
//     },
//     {
//       key: "chi-dinh",
//       label: "Chỉ định",
//       children: (
//         <PhieuChiDinhPage
//           benhNhanId={selectedPatient?.id}
//           phieuKhamId={selectedPhieuKham?.id}
//           isLocked={isExamLocked}
//           refreshKey={refreshKey}
//         />
//       ),
//     },
//     {
//       key: "don-thuoc",
//       label: "Đơn thuốc",
//       children: (
//         <DonThuocPage
//           phieuKhamId={selectedPhieuKham?.id}
//           isLocked={isExamLocked}
//           refreshKey={refreshKey}
//         />
//       ),
//     },
//     {
//       key: "ho-so",
//       label: "Hồ sơ tài liệu",
//       children: (
//         <HoSoTaiLieuPage
//           benhNhanId={selectedPatient?.id}
//           phieuKhamId={selectedPhieuKham?.id}
//           isLocked={isExamLocked}
//           refreshKey={refreshKey}
//         />
//       ),
//     },
//   ];

//   function renderMainContent() {
//     if (activeMenu === "thong-tin") {
//       return <ThongTinBS selectedDoctorId={selectedDoctorId} onDoctorChange={setSelectedDoctorId} />;
//     }

//     if (!selectedPatient) {
//       return (
//         <QuanLyBenhNhanPage
//           selectedDoctorId={selectedDoctorId}
//           onSelectPatient={(patient) => {
//             setSelectedPatient(patient);
//             setSelectedPhieuKham(null);
//             setActiveExamTab("phieu-kham");
//           }}
//         />
//       );
//     }

//     if (!selectedPhieuKham) {
//       return (
//         <LichSuKhamPage
//           selectedDoctorId={selectedDoctorId}
//           selectedPatient={selectedPatient}
//           onBack={() => setSelectedPatient(null)}
//           onSelectPhieuKham={(phieuKham) => {
//             setSelectedPhieuKham(phieuKham);
//             setRefreshKey((prev) => prev + 1);
//             setActiveExamTab("phieu-kham");
//           }}
//         />
//       );
//     }

//     return (
//       <div className="space-y-4">
//         <Alert
//           type={isExamLocked ? "success" : "info"}
//           showIcon
//           message={`Đang khám: ${selectedPatient.name} - ${selectedPhieuKham.ma_phieu_kham || `PK#${selectedPhieuKham.id}`}`}
//           description={isExamLocked ? "Phiếu khám đã hoàn thành, dữ liệu chỉ còn chế độ xem." : "Bạn có thể chỉnh sửa từng mục và lưu riêng trước khi hoàn tất khám."}
//           action={
//             <div className="flex gap-2">
//               <Button
//                 className="!h-10 !px-5 !font-semibold !border-teal-600 !text-teal-700 hover:!text-teal-800 hover:!border-teal-700"
//                 onClick={() => setSelectedPhieuKham(null)}
//               >
//                 Đổi phiếu khám
//               </Button>
//               <Button
//                 type="primary"
//                 loading={finishing}
//                 disabled={isExamLocked}
//                 className="!h-10 !px-5 !font-semibold !bg-teal-600 hover:!bg-teal-700 !border-teal-600"
//                 onClick={handleFinishExam}
//               >
//                 Hoàn tất khám
//               </Button>
//             </div>
//           }
//         />

//         <Tabs
//           activeKey={activeExamTab}
//           onChange={setActiveExamTab}
//           items={examTabs}
//           destroyInactiveTabPane={false}
//         />
//       </div>
//     );
//   }

//   return (
//     <>
//       {contextHolder}
//       <DoctorLayout
//         activeKey={activeMenu}
//         onMenuChange={(menuKey) => {
//           setActiveMenu(menuKey);
//           if (menuKey === "quan-ly-benh-nhan") {
//             setSelectedPhieuKham(null);
//           }
//         }}
//         menuItems={MENU_ITEMS}
//         doctorName={doctorName}
//       >
//         {renderMainContent()}
//       </DoctorLayout>
//     </>
//   );
// }
