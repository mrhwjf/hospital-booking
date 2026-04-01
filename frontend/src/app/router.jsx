import { Link, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import ProfileDoctorPage from '../features/admin/pages/ProfileDoctorPage'
import ProfileStaffPage from '../features/admin/pages/ProfileStaffPage'
import RolePermissionPage from '../features/admin/pages/RolePermissionPage'
import SystemConfigPage from '../features/admin/pages/SystemConfigPage'
import UserManagementPage from '../features/admin/pages/UserManagementPage'
import BaoCaoDoanhThuPage from '../features/reports/pages/BaoCaoDoanhThuPage'
import BaoCaoLichHenPage from '../features/reports/pages/BaoCaoLichHenPage'

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
				<Link to="/admin/dashboard">Quay về dashboard</Link>
			</div>
		</div>
	)
}

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

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
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}
