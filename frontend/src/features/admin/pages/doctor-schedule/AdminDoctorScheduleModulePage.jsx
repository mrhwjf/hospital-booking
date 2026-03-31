import { useState } from 'react'
import { Card, Segmented, Space } from 'antd'
import DoctorWorkSchedulePage from './DoctorWorkSchedulePage'
import DoctorLeaveManagementPage from './DoctorLeaveManagementPage'
import HolidayManagementPage from './HolidayManagementPage'
import { ADMIN_SEGMENTED_STYLES } from '../../styles/const-styles'

export default function AdminDoctorScheduleModulePage() {
	const [activeTab, setActiveTab] = useState('doctor-work')

	return (
		<Space direction="vertical" size={16} className="w-full">
			<Card className="border-[#E2E8F0]">
				<Segmented
					value={activeTab}
					onChange={setActiveTab}
					className={ADMIN_SEGMENTED_STYLES}
					options={[
						{ label: 'Lịch làm việc bác sĩ', value: 'doctor-work' },
						{ label: 'Nghỉ bác sĩ', value: 'doctor-leave' },
						{ label: 'Ngày nghỉ lễ', value: 'holiday' },
					]}
				/>
			</Card>

			{activeTab === 'doctor-work' && <DoctorWorkSchedulePage />}
			{activeTab === 'doctor-leave' && <DoctorLeaveManagementPage />}
			{activeTab === 'holiday' && <HolidayManagementPage />}
		</Space>
	)
}
