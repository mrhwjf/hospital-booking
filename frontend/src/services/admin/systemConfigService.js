import {
  capNhatCauHinhHeThong as capNhatCauHinhHeThongApi,
  layDanhSachCauHinhHeThong as layDanhSachCauHinhHeThongApi,
} from '../../api/adminApi';

const DEFAULT_META = {
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
};

const normalizeListResponse = (response = {}) => {
  const items = response?.data?.items;
  const pagination = response?.data?.pagination ?? {};

  return {
    data: Array.isArray(items)
      ? items.map((item) => ({
          id: item.id,
          khoa: item.khoa ?? '',
          gia_tri: item.gia_tri ?? '',
          mo_ta: item.mo_ta ?? null,
          nhom: item.nhom ?? null,
          created_at: item.created_at ?? null,
          updated_at: item.updated_at ?? null,
        }))
      : [],
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

export const layDanhSachCauHinhHeThong = async (params = {}) => {
  const response = await layDanhSachCauHinhHeThongApi(params);
  return normalizeListResponse(response);
};

export const capNhatCauHinhHeThong = async (items = []) => {
  const payload = {
    items: (Array.isArray(items) ? items : []).map((item) => ({
      khoa: item.khoa,
      gia_tri: item.gia_tri == null ? '' : String(item.gia_tri),
      mo_ta: item.mo_ta ?? null,
      nhom: item.nhom ?? null,
    })),
  };

  const response = await capNhatCauHinhHeThongApi(payload);
  const updatedItems = response?.data?.items;

  return {
    data: Array.isArray(updatedItems)
      ? updatedItems.map((item) => ({
          id: item.id,
          khoa: item.khoa ?? '',
          gia_tri: item.gia_tri ?? '',
          mo_ta: item.mo_ta ?? null,
          nhom: item.nhom ?? null,
          created_at: item.created_at ?? null,
          updated_at: item.updated_at ?? null,
        }))
      : [],
    totalUpdated: response?.data?.totalUpdated ?? 0,
    message: response?.message ?? '',
  };
};

const systemConfigService = {
  layDanhSachCauHinhHeThong,
  capNhatCauHinhHeThong,
};

export default systemConfigService;
