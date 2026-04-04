import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { Space, Typography } from 'antd'
import AdminLayout from '../components/layout/AdminLayout'
import DoctorLayout from '../components/layout/DoctorLayout'
import PatientLayout from '../components/layout/PatientLayout'
import StaffLayout from '../components/layout/StaffLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import AdminDoctorScheduleModulePage from '../features/admin/pages/doctor-schedule/AdminDoctorScheduleModulePage'
import ProfileDoctorPage from '../features/admin/pages/ProfileDoctorPage'
import ProfileStaffPage from '../features/admin/pages/ProfileStaffPage'
import RolePermissionPage from '../features/admin/pages/RolePermissionPage'
import SystemConfigPage from '../features/admin/pages/SystemConfigPage'
import UserManagementPage from '../features/admin/pages/UserManagementPage'
import StaffProfilePage from '../features/clinical/pages/StaffProfilePage'
import ThongTinBS from '../features/clinical/pages/ThongTinBS'
import LayoutPlaygroundPage from '../features/devtools/pages/LayoutPlaygroundPage'
import LichSuKhamPage from '../features/patients/pages/lich-su-kham/LichSuKhamPage'
import BaoCaoDoanhThuPage from '../features/reports/pages/BaoCaoDoanhThuPage'
import BaoCaoLichHenPage from '../features/reports/pages/BaoCaoLichHenPage'
import DatLichPage from '../features/scheduling/pages/patients/DatLichPage'
import LichHenCuaToiPage from '../features/scheduling/pages/patients/LichHenCuaToiPage'
import LeTanQuanLyLichHenPage from '../features/scheduling/pages/receptionist/LeTanQuanLyLichHenPage'
import QuanLyBenhNhanPage from '../features/clinical/pages/QuanLyBenhNhanPage'

function NotFoundPage() {
	return (
		<div
			style={{
				minHeight: '70vh',
				display: 'grid',
				placeItems: 'center',
				background: 'linear-gradient(160deg, #F0FDFA 0%, #EFF6FF 100%)',
			}}
		>
			<div style={{ textAlign: 'center', padding: 16 }}>
				<h2 style={{ marginBottom: 8 }}>Không tìm thấy trang</h2>
				<p style={{ color: '#64748B', marginBottom: 16 }}>Liên kết không tồn tại hoặc đã thay đổi.</p>
				<Space>
					<Link to="/admin/dashboard">Quay về dashboard</Link>
				</Space>
			</div>
		</div>
	)
}

function LayoutPreviewContent({ title, description }) {
	return (
		<div>
			<Typography.Title level={3}>{title}</Typography.Title>
			<Typography.Paragraph>{description}</Typography.Paragraph>
		</div>
	)
}

function LogoutRedirect() {
	localStorage.removeItem('access_token')
	localStorage.removeItem('refresh_token')
	localStorage.removeItem('user')

	return <Navigate to="/" replace />
}

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

			<Route path="/dev/layout-playground" element={<LayoutPlaygroundPage />} />

			<Route path="/admin" element={<AdminLayout />}>
				<Route index element={<Navigate to="dashboard" replace />} />
				<Route path="dashboard" element={<DashboardPage />} />
				<Route path="users" element={<UserManagementPage />} />
				<Route path="doctors" element={<ProfileDoctorPage />} />
				<Route path="staffs" element={<ProfileStaffPage />} />
				<Route path="roles-permissions" element={<RolePermissionPage />} />
				<Route path="system-config" element={<SystemConfigPage />} />
				<Route path="reports/appointments" element={<BaoCaoLichHenPage />} />
				<Route path="reports/revenue" element={<BaoCaoDoanhThuPage />} />
				<Route path="doctor-schedule" element={<AdminDoctorScheduleModulePage />} />
			</Route>

			<Route path="/staff" element={<StaffLayout />}>
				<Route index element={<Navigate to="appointments" replace />} />
				<Route path="appointments" element={<LeTanQuanLyLichHenPage />} />
				<Route path="profile" element={<StaffProfilePage />} />
				<Route
					path="account-settings"
					element={<LayoutPreviewContent title="Cài đặt tài khoản" description="Khu vực cài đặt tài khoản nhân viên." />}
				/>
				<Route
					path="my-appointments"
					element={<LayoutPreviewContent title="Lịch hẹn của tôi" description="Danh sách lịch hẹn cá nhân của lễ tân/nhân viên." />}
				/>
				<Route
					path="visit-history"
					element={<LayoutPreviewContent title="Lịch sử khám" description="Khu vực lịch sử khám dành cho nhân viên." />}
				/>
				<Route path="logout" element={<LogoutRedirect />} />
			</Route>

			<Route path="/doctor" element={<DoctorLayout />}>
				<Route index element={<Navigate to="thong-tin" replace />} />
				<Route path="thong-tin" element={<ThongTinBS />} />
				<Route path="quan-ly-benh-nhan" element={<QuanLyBenhNhanPage />} />
				<Route path="logout" element={<LogoutRedirect />} />
			</Route>

			<Route path="/patient" element={<PatientLayout />}>
				<Route index element={<Navigate to="dat-lich" replace />} />
				<Route path="dat-lich" element={<DatLichPage />} />
				<Route path="lich-cua-toi" element={<LichHenCuaToiPage />} />
				<Route path="lich-su-kham" element={<LichSuKhamPage />} />
				<Route
					path="ho-so"
					element={<LayoutPreviewContent title="Hồ sơ bệnh nhân" description="Khu vực hồ sơ bệnh nhân đang được hoàn thiện." />}
				/>
				<Route path="logout" element={<LogoutRedirect />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}
