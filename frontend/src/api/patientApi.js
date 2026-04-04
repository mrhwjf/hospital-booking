import httpClient from './httpClient'

export const resolveCurrentPatientId = () => {
	const fromStorage = Number(window.localStorage.getItem('benh_nhan_id'))
	if (Number.isInteger(fromStorage) && fromStorage > 0) {
		return fromStorage
	}

	const fromEnv = Number(import.meta.env.VITE_DEFAULT_BENH_NHAN_ID)
	if (Number.isInteger(fromEnv) && fromEnv > 0) {
		return fromEnv
	}

	return 1
}

const withPatientParams = (params = {}) => ({
	...params,
	benh_nhan_id: resolveCurrentPatientId(),
})

export const getCurrentPatientProfile = () =>
	httpClient.get('/benh-nhan/me', {
		params: withPatientParams(),
	})

export const getVisitHistory = (params = {}) =>
	httpClient.get('/benh-nhan/lich-su-kham', {
		params: withPatientParams(params),
	})

export const getVisitDetail = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}`, {
		params: withPatientParams(),
	})

export const getVisitChiDinhs = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/chi-dinh`, {
		params: withPatientParams(),
	})

export const getVisitDonThuoc = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/don-thuoc`, {
		params: withPatientParams(),
	})

export const getVisitTaiLieus = (visitId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/tai-lieu`, {
		params: withPatientParams(),
	})

export const getVisitTaiLieuSignedUrl = (visitId, taiLieuId) =>
	httpClient.get(`/benh-nhan/lich-su-kham/${visitId}/tai-lieu/${taiLieuId}/signed-url`, {
		params: withPatientParams(),
	})
// Cấu hình endpoint URLs cho patient API.

export const PATIENT_ENDPOINTS = {
	lichSuPhieuKham: (benhNhanId) => `/benh-nhan/${benhNhanId}/lich-su-phieu-kham`,
	taiLieuHoSo: (benhNhanId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so`,
	taiLieuHoSoById: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}`,
	taiLieuHoSoUpload: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/upload`,
	taiLieuHoSoSignedUrl: (benhNhanId, taiLieuId) => `/benh-nhan/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/signed-url`,
};
