import {
  layDanhSachVaiTro as layDanhSachVaiTroApi,
  layChiTietVaiTro as layChiTietVaiTroApi,
  taoVaiTro as taoVaiTroApi,
  capNhatVaiTro as capNhatVaiTroApi,
  xoaVaiTro as xoaVaiTroApi,
  layDanhSachQuyen as layDanhSachQuyenApi,
  taoQuyen as taoQuyenApi,
  capNhatQuyen as capNhatQuyenApi,
  xoaQuyen as xoaQuyenApi,
} from '../../api/adminApi';

const DEFAULT_META = {
  page: 1,
  perPage: 10,
  total: 0,
  totalPages: 0,
};

const pickPayload = (payload = {}, allowedKeys = []) =>
  allowedKeys.reduce((acc, key) => {
    if (payload[key] !== undefined) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});

const makeValidationError = (errors = {}, fallbackMessage = 'Dữ liệu không hợp lệ.') => {
  const error = new Error(fallbackMessage);
  error.response = {
    data: {
      message: fallbackMessage,
      errors,
    },
  };
  return error;
};

const normalizeRolePayload = (payload = {}, { requireCode = false, requireName = false } = {}) => {
  const rawCode = payload.ma_vai_tro;
  const rawName = payload.ten_vai_tro;

  const maVaiTro =
    rawCode === undefined || rawCode === null
      ? undefined
      : String(rawCode).trim().toUpperCase().replace(/\s+/g, '');

  const tenVaiTro =
    rawName === undefined || rawName === null
      ? undefined
      : String(rawName).trim();

  const quyenIds = Array.isArray(payload.quyen_ids)
    ? payload.quyen_ids
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    : payload.quyen_ids;

  const errors = {};
  if (requireCode && !maVaiTro) {
    errors.ma_vai_tro = ['Vui lòng nhập mã vai trò.'];
  }
  if (requireName && !tenVaiTro) {
    errors.ten_vai_tro = ['Vui lòng nhập tên vai trò.'];
  }

  if (Object.keys(errors).length > 0) {
    throw makeValidationError(errors, 'Vui lòng kiểm tra lại thông tin vai trò.');
  }

  return {
    ...payload,
    ma_vai_tro: maVaiTro,
    ten_vai_tro: tenVaiTro,
    mo_ta:
      payload.mo_ta === undefined || payload.mo_ta === null
        ? payload.mo_ta
        : String(payload.mo_ta).trim() || null,
    quyen_ids: quyenIds,
  };
};

const normalizeList = (response = {}) => {
  const root = response?.data ?? response ?? {};
  const items = root?.items ?? root?.data ?? [];
  const pagination = root?.pagination ?? response?.meta ?? {};

  return {
    items: Array.isArray(items) ? items : [],
    meta: {
      ...DEFAULT_META,
      page: pagination.currentPage ?? pagination.page ?? DEFAULT_META.page,
      perPage: pagination.pageSize ?? pagination.per_page ?? DEFAULT_META.perPage,
      total: pagination.totalItems ?? pagination.total ?? DEFAULT_META.total,
      totalPages: pagination.totalPages ?? DEFAULT_META.totalPages,
    },
    message: response?.message ?? '',
  };
};

const normalizePermission = (item = {}) => ({
  id: item.id,
  ma_quyen: item.ma_quyen ?? '',
  ten_quyen: item.ten_quyen ?? '',
  mo_ta: item.mo_ta ?? '',
  nhom_quyen: item.nhom_quyen ?? 'khac',
  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
  so_vai_tro: item.so_vai_tro ?? item.usage_count ?? 0,
});

const normalizeRolePermission = (item = {}) => ({
  id: item.id,
  ma_quyen: item.ma_quyen ?? item.permission_code ?? '',
  ten_quyen: item.ten_quyen ?? item.permission_name ?? '',
  nhom_quyen: item.nhom_quyen ?? 'khac',
});

const normalizeRole = (item = {}) => ({
  id: item.id,
  ma_vai_tro: item.ma_vai_tro ?? '',
  ten_vai_tro: item.ten_vai_tro ?? '',
  mo_ta: item.mo_ta ?? '',
  trang_thai: item.trang_thai ?? 'hoat_dong',
  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
  so_tai_khoan:
    item.so_tai_khoan ?? item.so_nguoi_dung_dang_su_dung ?? item.account_count ?? 0,
  quyens: Array.isArray(item.quyens)
    ? item.quyens.map(normalizeRolePermission)
    : Array.isArray(item.permissions)
      ? item.permissions.map(normalizeRolePermission)
      : [],
});

export const layDanhSachVaiTro = async (params = {}) => {
  const response = await layDanhSachVaiTroApi(params);
  const normalized = normalizeList(response);
  return {
    data: normalized.items.map(normalizeRole),
    meta: normalized.meta,
    message: normalized.message,
  };
};

export const layChiTietVaiTro = async (id) => {
  const response = await layChiTietVaiTroApi(id);
  const item = response?.data?.item ?? response?.data ?? response ?? {};
  return normalizeRole(item);
};

export const taoVaiTro = async (payload = {}) => {
  const normalizedPayload = normalizeRolePayload(payload, {
    requireCode: true,
    requireName: true,
  });
  const body = pickPayload(normalizedPayload, [
    'ma_vai_tro',
    'ten_vai_tro',
    'mo_ta',
    'trang_thai',
    'quyen_ids',
  ]);
  const response = await taoVaiTroApi(body);
  return normalizeRole(response?.data ?? response ?? {});
};

export const capNhatVaiTro = async (id, payload = {}) => {
  const normalizedPayload = normalizeRolePayload(payload);
  const body = pickPayload(normalizedPayload, [
    'ma_vai_tro',
    'ten_vai_tro',
    'mo_ta',
    'trang_thai',
    'quyen_ids',
  ]);
  return capNhatVaiTroApi(id, body);
};

export const xoaVaiTro = async (id) => xoaVaiTroApi(id);

export const layDanhSachQuyen = async (params = {}) => {
  const response = await layDanhSachQuyenApi(params);
  const normalized = normalizeList(response);
  return {
    data: normalized.items.map(normalizePermission),
    meta: normalized.meta,
    message: normalized.message,
  };
};

export const taoQuyen = async (payload = {}) => {
  const body = pickPayload(payload, ['ma_quyen', 'ten_quyen', 'mo_ta', 'nhom_quyen']);
  const response = await taoQuyenApi(body);
  return normalizePermission(response?.data ?? response ?? {});
};

export const capNhatQuyen = async (id, payload = {}) => {
  const body = pickPayload(payload, ['ma_quyen', 'ten_quyen', 'mo_ta', 'nhom_quyen']);
  return capNhatQuyenApi(id, body);
};

export const xoaQuyen = async (id) => xoaQuyenApi(id);

const rolePermissionService = {
  layDanhSachVaiTro,
  layChiTietVaiTro,
  taoVaiTro,
  capNhatVaiTro,
  xoaVaiTro,
  layDanhSachQuyen,
  taoQuyen,
  capNhatQuyen,
  xoaQuyen,
};

export default rolePermissionService;