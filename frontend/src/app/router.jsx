import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Space, Typography } from 'antd'
import AdminLayout from '../components/layout/AdminLayout'
import DoctorLayout from '../components/layout/DoctorLayout'
import LandingPage from '../components/layout/LandingPage'
import PatientLayout from '../components/layout/PatientLayout'
import StaffLayout from '../components/layout/StaffLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import AdminDoctorScheduleModulePage from '../features/admin/pages/doctor-schedule/AdminDoctorScheduleModulePage'
import LoginPage from '../features/auth/pages/LoginPage'
import ProfilePage from '../features/auth/pages/ProfilePage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ProfileDoctorPage from '../features/admin/pages/ProfileDoctorPage'
import ProfileStaffPage from '../features/admin/pages/ProfileStaffPage'
import RolePermissionPage from '../features/admin/pages/RolePermissionPage'
import SystemConfigPage from '../features/admin/pages/SystemConfigPage'
import UserManagementPage from '../features/admin/pages/UserManagementPage'
import StaffProfilePage from '../features/clinical/pages/StaffProfilePage'
import ThongTinBS from '../features/clinical/pages/ThongTinBS'
import LayoutPlaygroundPage from '../features/devtools/pages/LayoutPlaygroundPage'
import LichSuKhamPage from '../features/patients/pages/lich-su-kham/LichSuKhamPage'
import PatientProfilePage from '../features/patients/pages/PatientProfilePage'
import Tongquan from '../features/patients/pages/Tongquan'
import Khamphachuyenmon from '../features/explore/Khamphachuyenmon'
import BaoCaoDoanhThuPage from '../features/reports/pages/BaoCaoDoanhThuPage'
import BaoCaoLichHenPage from '../features/reports/pages/BaoCaoLichHenPage'
import DatLichPage from '../features/scheduling/pages/patients/DatLichPage'
import LichHenCuaToiPage from '../features/scheduling/pages/patients/LichHenCuaToiPage'
import LeTanQuanLyLichHenPage from '../features/scheduling/pages/receptionist/LeTanQuanLyLichHenPage'
import QuanLyBenhNhanPage from '../features/clinical/pages/QuanLyBenhNhanPage'
import { clearStoredAuthState, getStoredAuthToken } from '../utils/userProfileSync'

const DEFAULT_HOME_BY_ROLE = {
	ADMIN: '/admin/dashboard',
	NHANVIEN: '/staff/appointments',
	LETAN: '/staff/appointments',
	BACSI: '/doctor/thong-tin',
	BENHNHAN: '/patient/dashboard',
}

const enableLayoutPlayground = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LAYOUT_PLAYGROUND === 'true'

const normalizeRole = (role) => String(role ?? '').trim().toUpperCase()

const getStoredRole = () => normalizeRole(localStorage.getItem('vai_tro'))

const resolveHomeByRole = (role) => DEFAULT_HOME_BY_ROLE[normalizeRole(role)] || '/login'

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
					<Link to="/">Quay về trang chủ</Link>
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

function RequireAuth({ allowedRoles = [] }) {
	const location = useLocation()
	const token = getStoredAuthToken()
	const role = getStoredRole()

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
		return <Navigate to={resolveHomeByRole(role)} replace />
	}

	return <Outlet />
}

function PublicOnlyRoute() {
	const token = getStoredAuthToken()
	const role = getStoredRole()

	if (token) {
		return <Navigate to={resolveHomeByRole(role)} replace />
	}

	return <Outlet />
}

function RootRedirect() {
	const token = getStoredAuthToken()
	const role = getStoredRole()

	if (!token) {
		return <LandingPage />
	}

	return <Navigate to={resolveHomeByRole(role)} replace />
}

function LogoutRedirect() {
	clearStoredAuthState()

	return <Navigate to="/login" replace />
}

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<RootRedirect />} />

			<Route element={<PublicOnlyRoute />}>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Route>

			{enableLayoutPlayground ? <Route path="/__visual-test/layouts" element={<LayoutPlaygroundPage />} /> : null}

			<Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
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
			</Route>

			<Route element={<RequireAuth allowedRoles={['NHANVIEN', 'LETAN']} />}>
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
			</Route>

			<Route element={<RequireAuth allowedRoles={['BACSI']} />}>
				<Route path="/doctor" element={<DoctorLayout />}>
					<Route index element={<Navigate to="thong-tin" replace />} />
					<Route path="thong-tin" element={<ThongTinBS />} />
					<Route path="quan-ly-benh-nhan" element={<QuanLyBenhNhanPage />} />
					<Route path="logout" element={<LogoutRedirect />} />
				</Route>
			</Route>

			<Route element={<RequireAuth allowedRoles={['BENHNHAN']} />}>
				<Route path="/patient" element={<PatientLayout />}>
					<Route index element={<Navigate to="dashboard" replace />} />
					<Route path="dashboard" element={<Tongquan />} />
					<Route path="kham-pha/*" element={<Khamphachuyenmon />} />
					<Route path="dat-lich" element={<DatLichPage />} />
					<Route path="lich-cua-toi" element={<LichHenCuaToiPage />} />
					<Route path="lich-su-kham" element={<LichSuKhamPage />} />
					<Route path="profile" element={<PatientProfilePage />} />
					<Route path="ho-so" element={<Navigate to="../profile" replace />} />
					<Route path="account" element={<ProfilePage />} />
					<Route path="logout" element={<LogoutRedirect />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}
