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
}

// CONTENT WILL BE USED IN FUTURE FOR FOR POST-MERGE REFACTORING

// import httpClient from './httpClient';

// /**
//  * Get current user's patient profile
//  * @returns {Promise}
//  */
// export const getPatientProfile = () => {
//   return httpClient.get('/patients/profile');
// };

// /**
//  * Get patient profile by ID (test endpoint - no auth required)
//  * @param {number} benhNhanId - Patient ID
//  * @returns {Promise}
//  */
// export const getPatientProfileTest = (benhNhanId) => {
//   // Using raw fetch instead of httpClient to avoid auth interceptor
//   return fetch(`http://localhost:8000/api/v1/patients/test/${benhNhanId}`)
//     .then(res => {
//       if (!res.ok) throw new Error(`API Error: ${res.status}`);
//       return res.json();
//     });
// };

// /**
//  * Update patient profile by ID (test endpoint - no auth required)
//  * @param {object} data - Profile data to update
//  * @param {number} patientId - Patient ID
//  * @returns {Promise}
//  */
// export const updatePatientProfileTest = (data, patientId) => {
//   // Using raw fetch for test endpoint
//   return fetch(`http://localhost:8000/api/v1/patients/update/${patientId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify(data)
//   }).then(res => {
//     if (!res.ok) throw new Error(`API Error: ${res.status}`);
//     return res.json();
//   });
// };

// /**
//  * Update current user's patient profile
//  * @param {object} data - Profile data to update
//  * @returns {Promise}
//  */
// export const updatePatientProfile = (data) => {
//   return httpClient.patch('/patients/profile', data);
// };
