import httpClient from './httpClient'

export const getChuyenKhoas = (params = {}) => httpClient.get('/chuyen-khoa', { params })

export const getBacSiTheoChuyenKhoa = (chuyenKhoaId, params = {}) =>
	httpClient.get(`/chuyen-khoa/${chuyenKhoaId}/bac-si`, { params })

export const getLichLamViecBacSi = (bacSiId, params = {}) =>
	httpClient.get(`/bac-si/${bacSiId}/lich-lam-viec`, { params })

export const getDichVus = (params = {}) => httpClient.get('/dich-vu', { params })

export const getGoiKhams = (params = {}) => httpClient.get('/goi-kham', { params })

export const createLichHen = (payload) => httpClient.post('/lich-hen', payload)

export const getLichHenById = (id) => httpClient.get(`/lich-hen/${id}`)
