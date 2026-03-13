import dayjs from 'dayjs'
import {
	createLichHen,
	getBacSiTheoChuyenKhoa,
	getChuyenKhoas,
	getDichVus,
	getGoiKhams,
	getLichLamViecBacSi,
} from '../api/schedulingApi'

const DEFAULT_LIST_PAGE_SIZE = 10

const mapItems = (response) => response?.data?.items || []

export const fetchSpecialties = async () => {
	const response = await getChuyenKhoas({ page: 1, pageSize: DEFAULT_LIST_PAGE_SIZE })
	return mapItems(response)
}


export const fetchDoctorsBySpecialty = async ({ chuyenKhoaId, keyword = '' }) => {
	if (!chuyenKhoaId) {
		return []
	}

	const response = await getBacSiTheoChuyenKhoa(chuyenKhoaId, {
		page: 1,
		pageSize: DEFAULT_LIST_PAGE_SIZE,
		ten: keyword,
	})

	return mapItems(response)
}

export const fetchServicesAndPackages = async ({ chuyenKhoaId, keyword = '' }) => {
	if (!chuyenKhoaId) {
		return { services: [], packages: [] }
	}

	const [serviceResponse, packageResponse] = await Promise.all([
		getDichVus({
			page: 1,
			pageSize: DEFAULT_LIST_PAGE_SIZE,
			chuyen_khoa_id: chuyenKhoaId,
			ten: keyword,
		}),
		getGoiKhams({
			page: 1,
			pageSize: DEFAULT_LIST_PAGE_SIZE,
			chuyen_khoa_id: chuyenKhoaId,
			ten: keyword,
		}),
	])

	return {
		services: mapItems(serviceResponse),
		packages: mapItems(packageResponse),
	}
}

export const fetchDoctorSchedule = async ({ bacSiId, fromDate, toDate }) => {
	if (!bacSiId) {
		return []
	}

	const response = await getLichLamViecBacSi(bacSiId, {
		tu_ngay: fromDate || dayjs().format('YYYY-MM-DD'),
		den_ngay: toDate || dayjs().add(30, 'day').format('YYYY-MM-DD'),
	})

	return response?.data?.items || []
}

export const submitAppointmentBooking = async (payload) => {
	const response = await createLichHen(payload)
	return response?.data
}

export const getApiErrorMessage = (error, fallbackMessage) => {
	const firstError =
		error?.response?.data?.data?.errors &&
		Object.values(error.response.data.data.errors)[0]?.[0]

	return firstError || fallbackMessage
}
