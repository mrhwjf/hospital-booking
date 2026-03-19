import { useState } from 'react'
import { Card, ConfigProvider, Segmented, Space } from 'antd'

import LichHenCuaToiPage from './features/scheduling/pages/patients/LichHenCuaToiPage'
import DatLichPage from './features/scheduling/pages/patients/DatLichPage'
import LeTanQuanLyLichHenPage from './features/scheduling/pages/receptionist/LeTanQuanLyLichHenPage.jsx.jsx'

function App() {
  const [view, setView] = useState('dat-lich')

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
      <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
        <Space direction="vertical" size={16} className="w-full">
          <Card className="border-[#E2E8F0]">
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { label: 'Dat lich', value: 'dat-lich' },
                { label: 'Lich hen cua toi', value: 'lich-cua-toi' },
                { label: 'Le tan quan ly', value: 'le-tan' },
              ]}
            />
          </Card>

          {view === 'dat-lich' && <DatLichPage />}
          {view === 'lich-cua-toi' && <LichHenCuaToiPage />}
          {view === 'le-tan' && <LeTanQuanLyLichHenPage />}
        </Space>
      </main>
    </ConfigProvider>
  )
}

export default App
