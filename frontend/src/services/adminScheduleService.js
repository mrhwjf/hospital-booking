import {
	createDoctorLeave,
	createHoliday,
	createScheduleAssignment,
	createWorkTemplate,
	getAdminDoctors,
	getAdminRooms,
	getAdminWorkTemplates,
	getAssignedSchedules,
	getDoctorLeaves,
	getDoctorScheduleOverview,
	getHolidays,
	getSystemConfigs,
	previewScheduleAssignment,
	softDeleteAssignedSchedule,
	softDeleteDoctorLeave,
	softDeleteHoliday,
	softDeleteWorkTemplate,
	updateAssignedSchedule,
	updateDoctorLeave,
	updateHoliday,
	updateWorkTemplate,
} from '../api/adminScheduleApi'
import { getApiErrorMessage } from '../utils/apiError'

const DEFAULT_PAGE_SIZE = 10

const mapItems = (response) => response?.data?.items || []
const mapPagination = (response) => response?.data?.pagination || null

export const fetchAdminDoctors = async (params = {}) => {
	const response = await getAdminDoctors({ page: 1, pageSize: 100, ...params })
	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const fetchAdminRooms = async (params = {}) => {
	const response = await getAdminRooms({ page: 1, pageSize: 100, ...params })
	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const fetchWorkTemplates = async (params = {}) => {
	const response = await getAdminWorkTemplates({ page: 1, pageSize: 100, ...params })
	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const fetchDoctorScheduleOverview = async ({ doctorId, fromDate, toDate }) => {
	if (!doctorId) {
		return null
	}

	const response = await getDoctorScheduleOverview(doctorId, {
		tu_ngay: fromDate,
		den_ngay: toDate,
	})

	return response?.data || null
}

export const fetchAssignedSchedules = async ({
	bacSiId,
	trangThai,
	fromDate,
	toDate,
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
} = {}) => {
	const response = await getAssignedSchedules({
		bac_si_id: bacSiId,
		trang_thai: trangThai,
		tu_ngay: fromDate,
		den_ngay: toDate,
		page,
		pageSize,
	})

	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const submitCreateWorkTemplate = async (payload) => {
	const response = await createWorkTemplate(payload)
	return response?.data || null
}

export const submitUpdateWorkTemplate = async (id, payload) => {
	const response = await updateWorkTemplate(id, payload)
	return response?.data || null
}

export const submitDeleteWorkTemplate = async (id) => {
	const response = await softDeleteWorkTemplate(id)
	return response?.data || null
}

export const submitPreviewAssignment = async (payload) => {
	const response = await previewScheduleAssignment(payload)
	return response?.data || null
}

export const submitCreateAssignment = async (payload) => {
	const response = await createScheduleAssignment(payload)
	return response
}

export const submitUpdateAssignedSchedule = async (id, payload) => {
	const response = await updateAssignedSchedule(id, payload)
	return response?.data || null
}

export const submitDeleteAssignedSchedule = async (id) => {
	const response = await softDeleteAssignedSchedule(id)
	return response?.data || null
}

export const fetchDoctorLeaves = async ({
	bacSiId,
	trangThai,
	fromDate,
	toDate,
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
} = {}) => {
	const response = await getDoctorLeaves({
		bac_si_id: bacSiId,
		trang_thai: trangThai,
		tu_ngay: fromDate,
		den_ngay: toDate,
		page,
		pageSize,
	})

	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const submitCreateDoctorLeave = async (payload) => {
	const response = await createDoctorLeave(payload)
	return response?.data || null
}

export const submitUpdateDoctorLeave = async (id, payload) => {
	const response = await updateDoctorLeave(id, payload)
	return response?.data || null
}

export const submitDeleteDoctorLeave = async (id) => {
	const response = await softDeleteDoctorLeave(id)
	return response?.data || null
}

export const fetchHolidays = async ({
	trangThai,
	fromDate,
	toDate,
	ten,
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
} = {}) => {
	const response = await getHolidays({
		trang_thai: trangThai,
		tu_ngay: fromDate,
		den_ngay: toDate,
		ten,
		page,
		pageSize,
	})

	return {
		items: mapItems(response),
		pagination: mapPagination(response),
	}
}

export const submitCreateHoliday = async (payload) => {
	const response = await createHoliday(payload)
	return response?.data || null
}

export const submitUpdateHoliday = async (id, payload) => {
	const response = await updateHoliday(id, payload)
	return response?.data || null
}

export const submitDeleteHoliday = async (id) => {
	const response = await softDeleteHoliday(id)
	return response?.data || null
}

export const fetchAdminSystemConfigs = async (params = {}) => {
	const response = await getSystemConfigs(params)
	return {
		items: response?.data?.items || [],
		map: response?.data?.map || {},
	}
}

export { getApiErrorMessage }
