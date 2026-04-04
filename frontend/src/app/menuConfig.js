export const MENU_CONFIG = {
	ADMIN: [
		{ key: 'dashboard', label: 'Tổng quan hệ thống', icon: 'dashboard', route: '/admin/dashboard' },
		{ key: 'users', label: 'Quản lý tài khoản', icon: 'team', route: '/admin/users' },
		{ key: 'doctors', label: 'Hồ sơ bác sĩ', icon: 'doctor', route: '/admin/doctors' },
		{ key: 'staffs', label: 'Hồ sơ nhân viên', icon: 'staff', route: '/admin/staffs' },
		{ key: 'roles-permissions', label: 'Vai trò và quyền', icon: 'shield', route: '/admin/roles-permissions' },
		{ key: 'system-config', label: 'Cấu hình hệ thống', icon: 'setting', route: '/admin/system-config' },
		{ key: 'reports-appointments', label: 'Báo cáo lịch hẹn', icon: 'file', route: '/admin/reports/appointments' },
		{ key: 'reports-revenue', label: 'Báo cáo doanh thu', icon: 'chart', route: '/admin/reports/revenue' },
		{ key: 'doctor-schedule', label: 'Lịch làm việc bác sĩ', icon: 'schedule', route: '/admin/doctor-schedule' },
	],
	RECEPTIONIST: [
		{ key: 'appointments', label: 'Quản lý lịch hẹn', icon: 'schedule', route: '/staff/appointments' },
		{ key: 'profile', label: 'Hồ sơ nhân viên', icon: 'user', route: '/staff/profile' },
		{ key: 'account-settings', label: 'Cài đặt tài khoản', icon: 'setting', route: '/staff/account-settings' },
		{ key: 'logout', label: 'Đăng xuất', icon: 'logout', route: '/staff/logout' },
	],
	DOCTOR: [
		{ key: 'doctor-info', label: 'Thông tin bác sĩ', icon: 'user', route: '/doctor/thong-tin' },
		{ key: 'patient-management', label: 'Quản lý bệnh nhân', icon: 'team', route: '/doctor/quan-ly-benh-nhan' },
		{ key: 'logout', label: 'Đăng xuất', icon: 'logout', route: '/doctor/logout' },
	],
	PATIENT: [
		{ key: 'booking', label: 'Đặt lịch', icon: 'calendar', route: '/patient/dat-lich' },
		{ key: 'my-appointments', label: 'Lịch hẹn của tôi', icon: 'schedule', route: '/patient/lich-cua-toi' },
		{ key: 'visit-history', label: 'Lịch sử khám', icon: 'file', route: '/patient/lich-su-kham' },
		{ key: 'profile', label: 'Hồ sơ bệnh nhân', icon: 'user', route: '/patient/ho-so' },
		{ key: 'logout', label: 'Đăng xuất', icon: 'logout', route: '/patient/logout' },
	],
}
