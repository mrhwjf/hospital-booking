import httpClient from './httpClient'

const unwrapData = (response) => {
	if (response && typeof response === 'object' && 'data' in response) {
		return response.data
	}

	return response
}

export const getPatientProfile = () =>
	httpClient.get('/benh-nhan/profile').then(unwrapData)

export const updatePatientProfile = (data) =>
	httpClient.put('/benh-nhan/profile', data).then(unwrapData)

export const getCurrentPatientProfile = () =>
	httpClient.get('/benh-nhan/me')

export const getVisitHistory = (params = {}) =>
	httpClient.get('/benh-nhan/lich-su-kham', {
		params,
	})

export const getVisitDetail = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}`)

export const getVisitChiDinhs = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/chi-dinh`)

export const getVisitDonThuoc = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/don-thuoc`)

export const getVisitTaiLieus = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/tai-lieu`)

export const getVisitTaiLieuSignedUrl = (visitId, taiLieuId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/tai-lieu/${taiLieuId}/signed-url`)
// Cấu hình endpoint URLs cho patient API.

export const PATIENT_ENDPOINTS = {
	lichSuPhieuKham: (benhNhanId) => `/benh-nhan/${benhNhanId}/lich-su-phieu-kham`,
	taiLieuHoSo: (benhNhanId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so`,
	taiLieuHoSoById: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}`,
	taiLieuHoSoUpload: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/upload`,
	taiLieuHoSoSignedUrl: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/signed-url`,
}
