import httpClient from './httpClient'

export const layDashboardAdmin = (params = {}) =>
	httpClient.get('/bao-cao/dashboard-admin', { params })

export const layBaoCaoLichHen = (params = {}) =>
	httpClient.get('/bao-cao/lich-hen', { params })

export const layBaoCaoDoanhThu = (params = {}) =>
	httpClient.get('/bao-cao/doanh-thu', { params })
