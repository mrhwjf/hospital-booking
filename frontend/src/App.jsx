import { useState } from 'react'
import { ConfigProvider } from 'antd'

import LichHenCuaToiPage from './features/scheduling/pages/patients/LichHenCuaToiPage'
import DatLichPage from './features/scheduling/pages/patients/DatLichPage'
import LeTanQuanLyLichHenPage from './features/scheduling/pages/receptionist/LeTanQuanLyLichHenPage'
import AdminDoctorScheduleModulePage from './features/admin/pages/doctor-schedule/AdminDoctorScheduleModulePage'
import LichSuKhamPage from './features/patients/pages/lich-su-kham/LichSuKhamPage'
import StaffProfilePage from './features/clinical/pages/StaffProfilePage'
import StaffLayout from './components/layout/StaffLayout'

const MODULE_OPTIONS = [
  { label: 'Đặt lịch', value: 'dat-lich' },
  { label: 'Lịch hẹn của tôi', value: 'lich-cua-toi' },
  { label: 'Lịch sử khám', value: 'lich-su-kham' },
  { label: 'Hồ sơ nhân viên', value: 'ho-so-nhan-vien' },
  { label: 'Lễ tân quản lý', value: 'le-tan' },
  { label: 'Admin lịch bác sĩ', value: 'admin-lich-bac-si' },
  { label: 'Đăng xuất', value: 'logout' },
]

function App() {
  const [view, setView] = useState('dat-lich')

  const renderActiveView = () => {
    switch (view) {
      case 'dat-lich':
        return <DatLichPage />
      case 'lich-cua-toi':
        return <LichHenCuaToiPage />
      case 'lich-su-kham':
        return <LichSuKhamPage />
      case 'ho-so-nhan-vien':
        return <StaffProfilePage />
      case 'le-tan':
        return <LeTanQuanLyLichHenPage />
      case 'admin-lich-bac-si':
        return <AdminDoctorScheduleModulePage />
      case 'logout':
        return null;
      default:
        return <DatLichPage />
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0F766E',
          colorInfo: '#2563EB',
          colorSuccess: '#16A34A',
          colorWarning: '#F59E0B',
          colorError: '#DC2626',
          colorTextBase: '#0F172A',
          colorBorder: '#E2E8F0',
          colorBgLayout: '#F8FAFC',
        },
      }}
    >
      <StaffLayout
        menuItems={MODULE_OPTIONS}
        activeKey={view}
        onMenuChange={setView}
        staffName="Lê Thị Thu"
      >
        {renderActiveView()}
      </StaffLayout>
    </ConfigProvider>
  )
}

export default App