import httpClient from './httpClient'

const HARDCODED_STAFF_USER_ID = 4

export const resolveCurrentStaffUserId = () => HARDCODED_STAFF_USER_ID

export const getCurrentStaffProfile = () =>
	httpClient.get('/nhan-vien/me', {
		params: {
			nguoi_dung_id: resolveCurrentStaffUserId(),
		},
	})
// Cấu hình endpoint URLs cho clinical API.
// Tất cả hàm gọi API thực tế nằm trong src/Services/clinicalService.js

export const CLINICAL_ENDPOINTS = {
	// Phiếu khám
	phieuKhamList: () => "/phieu-kham",
	phieuKham: (id) => `/phieu-kham/${id}`,

	// Chỉ định dịch vụ
	dichVuList: () => "/clinical/dich-vu",
	chiDinhList: (phieuKhamId) => `/phieu-kham/${phieuKhamId}/chi-dinh`,
	chiDinh: (phieuKhamId) => `/phieu-kham/${phieuKhamId}/chi-dinh`,

	// Đơn thuốc
	donThuocByPhieuKham: (phieuKhamId) => `/phieu-kham/${phieuKhamId}/don-thuoc`,
	createDonThuoc: (phieuKhamId) => `/phieu-kham/${phieuKhamId}/don-thuoc`,
	donThuocItems: (donThuocId) => `/don-thuoc/${donThuocId}/items`,
	donThuoc: (donThuocId) => `/don-thuoc/${donThuocId}`,
	thuocList: () => "/thuoc",

	// Bác sĩ
	thongTinBacSi: () => "/bac-si/thong-tin",
	lichLamViecBacSi: () => "/bac-si/lich-lam-viec",
};
