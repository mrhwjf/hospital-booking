import httpClient from './httpClient'

export const getChuyenKhoas = (params = {}) => httpClient.get('/chuyen-khoa', { params })

export const getBacSiTheoChuyenKhoa = (chuyenKhoaId, params = {}) =>
	httpClient.get(`/chuyen-khoa/${chuyenKhoaId}/bac-si`, { params })

export const getLichLamViecBacSi = (bacSiId, params = {}) =>
	httpClient.get(`/bac-si/${bacSiId}/lich-lam-viec`, { params })

export const getDichVus = (params = {}) => httpClient.get('/dich-vu', { params })

export const getGoiKhams = (params = {}) => httpClient.get('/goi-kham', { params })

export const getCauHinhHeThong = (params = {}) => httpClient.get('/cau-hinh-he-thong', { params })

export const getBenhNhans = (params = {}) => httpClient.get('/benh-nhan', { params })

export const getBenhNhanById = (id) => httpClient.get(`/benh-nhan/${id}`)

export const createBenhNhan = (payload) => httpClient.post('/benh-nhan', payload)

export const createLichHen = (payload) => httpClient.post('/lich-hen', payload)

export const getLichHenById = (id) => httpClient.get(`/lich-hen/${id}`)

export const getLichHenCuaToi = (params = {}) => httpClient.get('/lich-hen', { params })

export const getLichHenLeTan = (params = {}) => httpClient.get('/lich-hen', { params })

export const getLyDoHuyBenhNhan = () => httpClient.get('/ly-do-huy/benh-nhan')

export const cancelLichHen = (id, payload) => httpClient.patch(`/lich-hen/${id}/huy`, payload)

export const rescheduleLichHen = (id, payload) => httpClient.patch(`/lich-hen/${id}/doi-lich`, payload)

export const checkInLichHen = (id, payload = {}) => httpClient.post(`/lich-hen/${id}/check-in`, payload)

export const getThongTinNhanVienHienTai = () => httpClient.get('/staff-profile/me')