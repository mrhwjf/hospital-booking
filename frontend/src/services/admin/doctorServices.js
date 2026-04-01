import {
	capNhatBacSi as capNhatBacSiApi,
	layDanhMucChuyenKhoa as layDanhMucChuyenKhoaApi,
	layDanhSachBacSi as layDanhSachBacSiApi,
	layDanhSachTaiKhoanBacSi as layDanhSachTaiKhoanBacSiApi,
	layChiTietBacSi as layChiTietBacSiApi,
	taoBacSi as taoBacSiApi,
	xoaBacSi as xoaBacSiApi,
} from '../../api/adminApi';

const DEFAULT_META = {
	page: 1,
	perPage: 10,
	total: 0,
	totalPages: 0,
};

const toSpecialtyItem = (item = {}) => ({
	id: item.id,
	ma_chuyen_khoa: item.ma_chuyen_khoa ?? '',
	ten_chuyen_khoa: item.ten_chuyen_khoa ?? '',
	trang_thai: item.trang_thai ?? 'hoat_dong',
});

const toDoctorAccountItem = (item = {}) => ({
	id: item.id,
	email: item.email ?? '',
	hinh_anh: item.hinh_anh ?? null,
	trang_thai: item.trang_thai ?? 'hoat_dong',
	co_ho_so_bac_si: Boolean(item.co_ho_so_bac_si),
	bac_si_id: item.bac_si_id ?? null,
});

const toDoctorItem = (item = {}) => {
	const chuyenKhoa = Array.isArray(item.chuyen_khoa) ? item.chuyen_khoa : [];

	return {
		id: item.id,
		ma_bac_si: item.ma_bac_si ?? '',
		nguoi_dung_id: item.nguoi_dung_id ?? null,
		email: item.email ?? '',
		hinh_anh: item.hinh_anh ?? null,
		ho_ten: item.ho_ten ?? '',
		so_dien_thoai: item.so_dien_thoai ?? '',
		hoc_vi: item.hoc_vi ?? 'bac_si',
		chung_chi_hanh_nghe: item.chung_chi_hanh_nghe ?? '',
		kinh_nghiem: item.kinh_nghiem ?? 0,
		gioi_thieu: item.gioi_thieu ?? '',
		trang_thai: item.trang_thai ?? 'hoat_dong',
		chuyen_khoa: chuyenKhoa,
		chuyen_khoa_ids: chuyenKhoa.map((entry) => entry.id),
		chuyen_khoa_chinh_id:
			chuyenKhoa.find((entry) => entry.la_chuyen_khoa_chinh)?.id ?? null,
		created_at: item.created_at ?? null,
		updated_at: item.updated_at ?? null,
	};
};

const pickPayload = (payload = {}, allowedKeys = []) =>
	allowedKeys.reduce((acc, key) => {
		if (payload[key] !== undefined) {
			acc[key] = payload[key];
		}
		return acc;
	}, {});

export const layDanhSachBacSi = async (params = {}) => {
	const response = await layDanhSachBacSiApi(params);
	const items = response?.data?.items;
	const pagination = response?.data?.pagination ?? {};

	return {
		data: Array.isArray(items) ? items.map(toDoctorItem) : [],
		meta: {
			...DEFAULT_META,
			page: pagination.currentPage ?? DEFAULT_META.page,
			perPage: pagination.pageSize ?? DEFAULT_META.perPage,
			total: pagination.totalItems ?? DEFAULT_META.total,
			totalPages: pagination.totalPages ?? DEFAULT_META.totalPages,
		},
		message: response?.message ?? '',
	};
};

export const layChiTietBacSi = async (id) => {
	const response = await layChiTietBacSiApi(id);
	return toDoctorItem(response?.data ?? {});
};

export const taoBacSi = async (payload = {}) => {
	const body = pickPayload(payload, [
		'kieu_tao',
		'nguoi_dung_id',
		'email',
		'mat_khau',
		'ho_ten',
		'so_dien_thoai',
		'hoc_vi',
		'chung_chi_hanh_nghe',
		'kinh_nghiem',
		'gioi_thieu',
		'hinh_anh',
		'trang_thai',
		'chuyen_khoa_ids',
		'chuyen_khoa_chinh_id',
	]);

	const response = await taoBacSiApi(body);
	return toDoctorItem(response?.data ?? {});
};

export const capNhatBacSi = async (id, payload = {}) => {
	const body = pickPayload(payload, [
		'email',
		'ho_ten',
		'so_dien_thoai',
		'hoc_vi',
		'chung_chi_hanh_nghe',
		'kinh_nghiem',
		'gioi_thieu',
		'hinh_anh',
		'trang_thai',
		'chuyen_khoa_ids',
		'chuyen_khoa_chinh_id',
	]);

	const response = await capNhatBacSiApi(id, body);
	return toDoctorItem(response?.data ?? {});
};

export const xoaBacSi = async (id) => xoaBacSiApi(id);

export const layDanhMucChuyenKhoa = async (params = {}) => {
	const response = await layDanhMucChuyenKhoaApi(params);
	const items = response?.data?.items;
	return Array.isArray(items) ? items.map(toSpecialtyItem) : [];
};

export const layDanhSachTaiKhoanBacSi = async (params = {}) => {
	const response = await layDanhSachTaiKhoanBacSiApi(params);
	const items = response?.data?.items;
	return Array.isArray(items) ? items.map(toDoctorAccountItem) : [];
};

const doctorServices = {
	layDanhSachBacSi,
	layChiTietBacSi,
	taoBacSi,
	capNhatBacSi,
	xoaBacSi,
	layDanhMucChuyenKhoa,
	layDanhSachTaiKhoanBacSi,
};

export default doctorServices;
