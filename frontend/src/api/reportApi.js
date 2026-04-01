import httpClient from './httpClient'

const ADMIN_ROLE_CONFIG = {
	headers: {
		'X-User-Role': 'ADMIN',
	},
}

export const layDashboardAdmin = (params = {}) =>
	httpClient.get('/bao-cao/dashboard-admin', { ...ADMIN_ROLE_CONFIG, params })

export const layBaoCaoLichHen = (params = {}) =>
	httpClient.get('/bao-cao/lich-hen', { ...ADMIN_ROLE_CONFIG, params })

export const layBaoCaoDoanhThu = (params = {}) =>
	httpClient.get('/bao-cao/doanh-thu', { ...ADMIN_ROLE_CONFIG, params })
