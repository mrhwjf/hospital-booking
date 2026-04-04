import httpClient from './httpClient'

export const getAdminDoctors = (params = {}) => httpClient.get('/quan-ly-lich-lam-viec/bac-si', { params })

export const getAdminRooms = (params = {}) => httpClient.get('/quan-ly-lich-lam-viec/phong-kham', { params })

export const getAdminWorkTemplates = (params = {}) => httpClient.get('/quan-ly-lich-lam-viec/mau-ca', { params })

export const getDoctorScheduleOverview = (doctorId, params = {}) =>
	httpClient.get(`/quan-ly-lich-lam-viec/bac-si/${doctorId}`, { params })

export const getAssignedSchedules = (params = {}) =>
	httpClient.get('/quan-ly-lich-lam-viec/phan-cong', { params })

export const createWorkTemplate = (payload) =>
	httpClient.post('/quan-ly-lich-lam-viec/mau-ca', payload)

export const updateWorkTemplate = (id, payload) =>
	httpClient.patch(`/quan-ly-lich-lam-viec/mau-ca/${id}`, payload)

export const softDeleteWorkTemplate = (id) =>
	httpClient.patch(`/quan-ly-lich-lam-viec/mau-ca/${id}/huy`)

export const previewScheduleAssignment = (payload) =>
	httpClient.post('/quan-ly-lich-lam-viec/xem-truoc-phan-cong', payload)

export const createScheduleAssignment = (payload) =>
	httpClient.post('/quan-ly-lich-lam-viec/phan-cong', payload)

export const updateAssignedSchedule = (id, payload) =>
	httpClient.patch(`/quan-ly-lich-lam-viec/phan-cong/${id}`, payload)

export const softDeleteAssignedSchedule = (id) =>
	httpClient.patch(`/quan-ly-lich-lam-viec/phan-cong/${id}/huy`)

export const getDoctorLeaves = (params = {}) =>
	httpClient.get('/quan-ly-nghi-bac-si', { params })

export const createDoctorLeave = (payload) =>
	httpClient.post('/quan-ly-nghi-bac-si', payload)

export const updateDoctorLeave = (id, payload) =>
	httpClient.patch(`/quan-ly-nghi-bac-si/${id}`, payload)

export const softDeleteDoctorLeave = (id) =>
	httpClient.patch(`/quan-ly-nghi-bac-si/${id}/huy`)

export const getHolidays = (params = {}) =>
	httpClient.get('/quan-ly-ngay-nghi-le', { params })

export const createHoliday = (payload) =>
	httpClient.post('/quan-ly-ngay-nghi-le', payload)

export const updateHoliday = (id, payload) =>
	httpClient.patch(`/quan-ly-ngay-nghi-le/${id}`, payload)

export const softDeleteHoliday = (id) =>
	httpClient.patch(`/quan-ly-ngay-nghi-le/${id}/huy`)

export const getSystemConfigs = (params = {}) =>
	httpClient.get('/cau-hinh-he-thong', { params })
