import {
	getCurrentPatientProfile,
	getVisitChiDinhs,
	getVisitDetail,
	getVisitDonThuoc,
	getVisitHistory,
	getVisitTaiLieus,
	getVisitTaiLieuSignedUrl,
} from '../api/patientApi'

const DEFAULT_LIST_PAGE_SIZE = 10

export const fetchCurrentPatientProfile = async () => {
	const response = await getCurrentPatientProfile()
	return response?.data || null
}

export const fetchVisitHistory = async ({
	page = 1,
	pageSize = DEFAULT_LIST_PAGE_SIZE,
	q = '',
	trangThai = 'all',
	tuNgay,
	denNgay,
} = {}) => {
	const response = await getVisitHistory({
		page,
		pageSize,
		q,
		trang_thai: trangThai,
		tu_ngay: tuNgay,
		den_ngay: denNgay,
	})

	return {
		items: response?.data?.items || [],
		pagination: response?.data?.pagination || null,
	}
}

export const fetchVisitDetail = async (visitId) => {
	const response = await getVisitDetail(visitId)
	const payload = response?.data || null

	if (!payload) {
		return {
			visit: null,
			chiDinhs: [],
			donThuoc: null,
			taiLieus: [],
		}
	}

	if (payload.visit || payload.chi_dinh || payload.don_thuoc || payload.tai_lieu) {
		return {
			visit: payload.visit || null,
			chiDinhs: payload.chi_dinh || [],
			donThuoc: payload.don_thuoc || null,
			taiLieus: payload.tai_lieu || [],
		}
	}

	return {
		visit: payload,
		chiDinhs: [],
		donThuoc: null,
		taiLieus: [],
	}
}

export const fetchVisitChiDinhs = async (visitId) => {
	const response = await getVisitChiDinhs(visitId)
	return response?.data?.items || []
}

export const fetchVisitDonThuoc = async (visitId) => {
	const response = await getVisitDonThuoc(visitId)
	return response?.data || null
}

export const fetchVisitTaiLieus = async (visitId) => {
	const response = await getVisitTaiLieus(visitId)
	return response?.data?.items || []
}

export const fetchVisitTaiLieuSignedUrl = async ({ visitId, taiLieuId }) => {
	const response = await getVisitTaiLieuSignedUrl(visitId, taiLieuId)
	return response?.data || null
}

export const getApiErrorMessage = (error, fallbackMessage) => {
	const firstError =
		error?.response?.data?.data?.errors &&
		Object.values(error.response.data.data.errors)[0]?.[0]

	return firstError || error?.response?.data?.message || fallbackMessage
}
