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
import {
	clearStoredAuthState,
	getStoredAuthToken,
	getStoredPermissions,
	hasStoredAllPermissions,
} from '../utils/userProfileSync'
import AccountProfile from '../features/auth/pages/ProfilePage'

const DEFAULT_HOME_BY_ROLE = {
	ADMIN: '/admin/dashboard',
	NHANVIEN: '/staff/appointments',
	LETAN: '/staff/appointments',
	BACSI: '/doctor/thong-tin',
	BENHNHAN: '/patient/dashboard',
}

const DEFAULT_HOME_BY_PERMISSION = [
	['quan_tri:nguoi_dung', '/admin/dashboard'],
	['nghiep_vu:quan_ly_lich_hen', '/staff/appointments'],
	['nghiep_vu:kham_benh', '/doctor/thong-tin'],
	['nghiep_vu:dat_lich', '/patient/dashboard'],
]

const enableLayoutPlayground = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LAYOUT_PLAYGROUND === 'true'

const normalizeRole = (role) => String(role ?? '').trim().toUpperCase()

const getStoredRole = () => normalizeRole(localStorage.getItem('vai_tro'))

const resolveHomeByRole = (role) => DEFAULT_HOME_BY_ROLE[normalizeRole(role)] || '/login'

const resolveHomeByPermission = (permissions = []) => {
	const permissionSet = new Set(
		Array.isArray(permissions)
			? permissions
				.map((permission) => String(permission ?? '').trim().toLowerCase())
				.filter(Boolean)
			: [],
	)

	for (const [permission, path] of DEFAULT_HOME_BY_PERMISSION) {
		if (permissionSet.has(permission)) {
			return path
		}
	}

	return null
}

const resolveHomePath = (role, permissions = []) => resolveHomeByPermission(permissions) || resolveHomeByRole(role)

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

function ForbiddenPage() {
	const role = getStoredRole()
	const permissions = getStoredPermissions()

	return (
		<div
			style={{
				minHeight: '70vh',
				display: 'grid',
				placeItems: 'center',
				background: 'linear-gradient(160deg, #FFF7ED 0%, #FFF1F2 100%)',
			}}
		>
			<div style={{ textAlign: 'center', padding: 16 }}>
				<h2 style={{ marginBottom: 8 }}>403 - Truy cập bị từ chối</h2>
				<p style={{ color: '#64748B', marginBottom: 16 }}>Bạn không có quyền truy cập trang này.</p>
				<Space>
					<Link to={resolveHomePath(role, permissions)}>Quay về trang chính</Link>
				</Space>
			</div>
		</div>
	)
}

function RequireAuth({ requiredPermissions = [] }) {
	const location = useLocation()
	const token = getStoredAuthToken()
	const permissions = getStoredPermissions()

	if (!token) {
		return <Navigate to="/" replace state={{ from: location }} />
	}

	if (requiredPermissions.length > 0 && !hasStoredAllPermissions(requiredPermissions)) {
		return <Navigate to="/forbidden" replace state={{ from: location }} />
	}

	return <Outlet />
}

function PublicOnlyRoute() {
	const token = getStoredAuthToken()
	const role = getStoredRole()
	const permissions = getStoredPermissions()

	if (token) {
		return <Navigate to={resolveHomePath(role, permissions)} replace />
	}

	return <Outlet />
}

function RootRedirect() {
	const token = getStoredAuthToken()
	const role = getStoredRole()
	const permissions = getStoredPermissions()

	if (!token) {
		return <LandingPage />
	}

	return <Navigate to={resolveHomePath(role, permissions)} replace />
}

function LogoutRedirect() {
	clearStoredAuthState()

	return <Navigate to="/" replace />
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

			<Route element={<RequireAuth requiredPermissions={['quan_tri:nguoi_dung']} />}>
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

			<Route element={<RequireAuth requiredPermissions={['nghiep_vu:quan_ly_lich_hen']} />}>
				<Route path="/staff" element={<StaffLayout />}>
					<Route index element={<Navigate to="appointments" replace />} />
					<Route path="appointments" element={<LeTanQuanLyLichHenPage />} />
					<Route path="profile" element={<StaffProfilePage />} />
					<Route path="account-settings" element={<AccountProfile />} />
					<Route path="logout" element={<LogoutRedirect />} />
				</Route>
			</Route>

			<Route element={<RequireAuth requiredPermissions={['nghiep_vu:kham_benh']} />}>
				<Route path="/doctor" element={<DoctorLayout />}>
					<Route index element={<Navigate to="thong-tin" replace />} />
					<Route path="thong-tin" element={<ThongTinBS />} />
					<Route path="quan-ly-benh-nhan" element={<QuanLyBenhNhanPage />} />
					<Route path="account-settings" element={<AccountProfile />} />
					<Route path="logout" element={<LogoutRedirect />} />
				</Route>
			</Route>

			<Route element={<RequireAuth requiredPermissions={['nghiep_vu:dat_lich']} />}>
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

			<Route path="/forbidden" element={<ForbiddenPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	)
}
