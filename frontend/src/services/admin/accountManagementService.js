import {
	capNhatNguoiDung as capNhatNguoiDungApi,
	layChiTietNguoiDung as layChiTietNguoiDungApi,
	layDanhSachNguoiDung as layDanhSachNguoiDungApi,
	resetMatKhau as resetMatKhauApi,
	taoNguoiDung as taoNguoiDungApi,
	toggleKhoaTaiKhoan as toggleKhoaTaiKhoanApi,
} from '../../api/adminApi';

const DEFAULT_META = {
	page: 1,
	perPage: 10,
	total: 0,
	totalPages: 0,
};

const toAccountItem = (item = {}) => ({
	id: item.id,
	email: item.email ?? '',
	vai_tro_id: item.vai_tro_id ?? null,
	vai_tro: item.vai_tro ?? '',
	ten_vai_tro: item.ten_vai_tro ?? '',
	hinh_anh: item.hinh_anh ?? null,
	trang_thai: item.trang_thai ?? 'hoat_dong',
	lan_dang_nhap_cuoi: item.lan_dang_nhap_cuoi ?? null,
	created_at: item.created_at ?? null,
	updated_at: item.updated_at ?? null,
});

const pickPayload = (payload = {}, allowedKeys = []) =>
	allowedKeys.reduce((acc, key) => {
		if (payload[key] !== undefined) {
			acc[key] = payload[key];
		}
		return acc;
	}, {});

export const layDanhSachNguoiDung = async (params = {}) => {
	const response = await layDanhSachNguoiDungApi(params);
	const items = response?.data?.items;
	const pagination = response?.data?.pagination ?? {};

	return {
		data: Array.isArray(items) ? items.map(toAccountItem) : [],
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

export const layChiTietNguoiDung = async (id) => {
	const response = await layChiTietNguoiDungApi(id);
	return toAccountItem(response?.data ?? {});
};

export const taoNguoiDung = async (payload = {}) => {
	const body = pickPayload(payload, ['email', 'mat_khau', 'vai_tro', 'hinh_anh', 'trang_thai']);
	const response = await taoNguoiDungApi(body);
	return toAccountItem(response?.data ?? {});
};

export const capNhatNguoiDung = async (id, payload = {}) => {
	const body = pickPayload(payload, ['email', 'vai_tro', 'hinh_anh', 'trang_thai']);
	return capNhatNguoiDungApi(id, body);
};

export const resetMatKhau = async (id, matKhauMoi) => {
	const body =
		typeof matKhauMoi === 'string' ? { mat_khau_moi: matKhauMoi } : (matKhauMoi ?? {});

	return resetMatKhauApi(id, body);
};

export const toggleKhoaTaiKhoan = async (id) => toggleKhoaTaiKhoanApi(id);

const accountManagementService = {
	layDanhSachNguoiDung,
	layChiTietNguoiDung,
	taoNguoiDung,
	capNhatNguoiDung,
	resetMatKhau,
	toggleKhoaTaiKhoan,
};

export default accountManagementService;
