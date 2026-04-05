import dayjs from 'dayjs'
import { getApiErrorMessage } from '../utils/apiError'
import {
	checkInLichHen,
	cancelLichHen,
	createBenhNhan,
	createLichHen,
	getBenhNhanById,
	getBenhNhans,
	getBacSiTheoChuyenKhoa,
	getCauHinhHeThong,
	getChuyenKhoas,
	getDichVus,
	getLichHenCuaToi,
	getLichHenLeTan,
	getLyDoHuyBenhNhan,
	getGoiKhams,
	getLichLamViecBacSi,
	rescheduleLichHen,
} from '../api/schedulingApi'

const DEFAULT_LIST_PAGE_SIZE = 10

export const resolveCurrentReceptionistUserId = () => {
	const fromStorage = Number(window.localStorage.getItem('nguoi_dung_id'))
	if (Number.isInteger(fromStorage) && fromStorage > 0) {
		return fromStorage
	}

	try {
		const user = JSON.parse(window.localStorage.getItem('user') || 'null')
		const parsedUserId = Number(user?.id || user?.nguoi_dung_id)
		if (Number.isInteger(parsedUserId) && parsedUserId > 0) {
			return parsedUserId
		}
	} catch {
		// Ignore malformed localStorage payload.
	}

	const fromEnv = Number(import.meta.env.VITE_DEFAULT_NGUOI_DUNG_ID)
	if (Number.isInteger(fromEnv) && fromEnv > 0) {
		return fromEnv
	}

	return 1
}

const mapItems = (response) => response?.data?.items || []

export const fetchSpecialties = async () => {
	const response = await getChuyenKhoas({ page: 1, pageSize: 100 })
	return mapItems(response)
}


export const fetchDoctorsBySpecialty = async ({ chuyenKhoaId, keyword = '' }) => {
	if (!chuyenKhoaId) {
		return []
	}

	const response = await getBacSiTheoChuyenKhoa(chuyenKhoaId, {
		page: 1,
		pageSize: 100,
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
			pageSize: 100,
			chuyen_khoa_id: chuyenKhoaId,
			ten: keyword,
		}),
		getGoiKhams({
			page: 1,
			pageSize: 100,
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

export const fetchBookingSystemConfigs = async () => {
	const response = await getCauHinhHeThong({ nhom: 'lich_hen' })

	return {
		items: response?.data?.items || [],
		map: response?.data?.map || {},
	}
}

export const submitAppointmentBooking = async (payload) => {
	const response = await createLichHen(payload)
	return response?.data
}

export const fetchMyAppointments = async ({ page = 1, pageSize = DEFAULT_LIST_PAGE_SIZE, trangThai } = {}) => {
	const response = await getLichHenCuaToi({
		page,
		pageSize,
		trang_thai: trangThai,
	})

	return {
		items: response?.data?.items || [],
		pagination: response?.data?.pagination || null,
	}
}

export const fetchReceptionistAppointments = async ({
	page = 1,
	pageSize = DEFAULT_LIST_PAGE_SIZE,
	q = '',
	trangThai,
	tuNgay,
	denNgay,
	benhNhanId,
	bacSiId,
} = {}) => {
	const response = await getLichHenLeTan({
		page,
		pageSize,
		q,
		trang_thai: trangThai,
		tu_ngay: tuNgay,
		den_ngay: denNgay,
		benh_nhan_id: benhNhanId,
		bac_si_id: bacSiId,
	})

	return {
		items: response?.data?.items || [],
		pagination: response?.data?.pagination || null,
	}
}

export const fetchPatients = async ({ q = '', page = 1, pageSize = DEFAULT_LIST_PAGE_SIZE } = {}) => {
	const response = await getBenhNhans({ q, page, pageSize })

	return {
		items: response?.data?.items || [],
		pagination: response?.data?.pagination || null,
	}
}

export const fetchPatientById = async (id) => {
	const response = await getBenhNhanById(id)
	return response?.data || null
}

export const submitCreatePatient = async (payload) => {
	const response = await createBenhNhan(payload)
	return response?.data || null
}

export const fetchCancellationReasons = async () => {
	const response = await getLyDoHuyBenhNhan()
	return response?.data?.items || []
}

export const submitCancelAppointment = async ({ lichHenId, lyDoHuyId, lyDoHuyKhac }) => {
	const response = await cancelLichHen(lichHenId, {
		ly_do_huy_id: lyDoHuyId || null,
		ly_do_huy_khac: lyDoHuyKhac || null,
	})

	return response?.data
}

export const submitRescheduleAppointment = async ({ lichHenId, payload }) => {
	const response = await rescheduleLichHen(lichHenId, payload)
	return response?.data
}

export const submitCheckInAppointment = async ({ lichHenId, nguoiTiepNhanId }) => {
	const response = await checkInLichHen(lichHenId, {
		nguoi_tiep_nhan_id: nguoiTiepNhanId || null,
	})

	return response?.data
}

export { getApiErrorMessage }
