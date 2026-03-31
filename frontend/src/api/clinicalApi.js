import httpClient from './httpClient';

// Phiếu khám
export const getPhieuKhamList = (params = {}) =>
	httpClient.get('/phieu-kham', { params });

// Đơn thuốc
export const getDonThuocByPhieuKham = (phieuKhamId) =>  
	httpClient.get(`/phieu-kham/${phieuKhamId}/don-thuoc`);

export const createDonThuoc = (phieuKhamId, payload) =>  
	httpClient.post(`/phieu-kham/${phieuKhamId}/don-thuoc`, payload);

export const addDonThuocItems = (donThuocId, payload) =>  
	httpClient.post(`/don-thuoc/${donThuocId}/items`, payload);

export const updateDonThuocItems = (donThuocId, payload) =>  
	httpClient.put(`/don-thuoc/${donThuocId}/items`, payload);

export const deleteDonThuoc = (donThuocId) =>   
	httpClient.delete(`/don-thuoc/${donThuocId}`);

export const searchThuoc = (params = {}) =>  
	httpClient.get('/thuoc', { params });


// Thông tin bác sĩ
export const getThongTinBacSiStatic = (params = {}) =>
	httpClient.get('/bac-si/thong-tin', { params });

export const getThongTinBacSiWeekly = (params = {}) =>
	httpClient.get('/bac-si/lich-lam-viec', { params });