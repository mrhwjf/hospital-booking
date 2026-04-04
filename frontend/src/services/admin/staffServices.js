import {
	capNhatNhanVien as capNhatNhanVienApi,
	layChiTietNhanVien as layChiTietNhanVienApi,
	layDanhSachNhanVien as layDanhSachNhanVienApi,
	layDanhSachTaiKhoanNhanVien as layDanhSachTaiKhoanNhanVienApi,
	taoNhanVien as taoNhanVienApi,
	xoaNhanVien as xoaNhanVienApi,
	layDanhSachTaiKhoanChuaLienKet as layDanhSachTaiKhoanChuaLienKetApi,
} from '../../api/adminApi';

const DEFAULT_META = {
	page: 1,
	perPage: 10,
	total: 0,
	totalPages: 0,
};

const toStaffItem = (item = {}) => ({
	id: item.id,
	ma_nhan_vien: item.ma_nhan_vien ?? '',
	nguoi_dung_id: item.nguoi_dung_id ?? null,
	email: item.email ?? '',
	hinh_anh: item.hinh_anh ?? null,
	ho_ten: item.ho_ten ?? '',
	so_dien_thoai: item.so_dien_thoai ?? '',
	chuc_vu: item.chuc_vu ?? 'le_tan',
	ngay_vao_lam: item.ngay_vao_lam ?? null,
	trang_thai: item.trang_thai ?? 'hoat_dong',
	ghi_chu: item.ghi_chu ?? '',
	created_at: item.created_at ?? null,
	updated_at: item.updated_at ?? null,
});

const toStaffAccountItem = (item = {}) => ({
	id: item.id,
	email: item.email ?? '',
	hinh_anh: item.hinh_anh ?? null,
	trang_thai: item.trang_thai ?? 'hoat_dong',
	co_ho_so_nhan_vien: Boolean(item.co_ho_so_nhan_vien),
	nhan_vien_id: item.nhan_vien_id ?? null,
});

const pickPayload = (payload = {}, allowedKeys = []) =>
	allowedKeys.reduce((acc, key) => {
		if (payload[key] !== undefined) {
			acc[key] = payload[key];
		}
		return acc;
	}, {});

export const layDanhSachNhanVien = async (params = {}) => {
	const response = await layDanhSachNhanVienApi(params);
	const items = response?.data?.items ?? response?.data;
	const pagination = response?.data?.pagination ?? response?.pagination ?? {};

	return {
		data: Array.isArray(items) ? items.map(toStaffItem) : [],
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

export const layDanhSachTaiKhoanNhanVienChuaLienKet = async (params = {}) => {
	const response = await layDanhSachTaiKhoanChuaLienKetApi(params);
	const items = response?.data?.items ?? response?.data;
	return {
		data: Array.isArray(items) ? items.map(toStaffAccountItem) : [],
		message: response?.message ?? '',
	};
}

export const layChiTietNhanVien = async (id) => {
	const response = await layChiTietNhanVienApi(id);
	return toStaffItem(response?.data ?? {});
};

export const taoNhanVien = async (payload = {}) => {
	const body = pickPayload(payload, [
		'nguoi_dung_id',
		'ho_ten',
		'so_dien_thoai',
		'chuc_vu',
		'ngay_vao_lam',
		'hinh_anh',
		'trang_thai',
		'ghi_chu',
	]);

	const response = await taoNhanVienApi(body);
	return toStaffItem(response?.data ?? {});
};

export const capNhatNhanVien = async (id, payload = {}) => {
	const body = pickPayload(payload, [
		'ho_ten',
		'so_dien_thoai',
		'chuc_vu',
		'ngay_vao_lam',
		'hinh_anh',
		'trang_thai',
		'ghi_chu',
	]);

	const response = await capNhatNhanVienApi(id, body);
	return toStaffItem(response?.data ?? {});
};

export const xoaNhanVien = async (id) => xoaNhanVienApi(id);

export const layDanhSachTaiKhoanNhanVien = async (params = {}) => {
	const response = await layDanhSachTaiKhoanNhanVienApi(params);
	const items = response?.data?.items;
	return Array.isArray(items) ? items.map(toStaffAccountItem) : [];
};

const staffServices = {
	layDanhSachNhanVien,
	layChiTietNhanVien,
	taoNhanVien,
	capNhatNhanVien,
	xoaNhanVien,
	layDanhSachTaiKhoanNhanVien,
};

export default staffServices;
