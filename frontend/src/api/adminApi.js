import httpClient from './httpClient';

const ADMIN_ROLE_CONFIG = {
  headers: {
    'X-User-Role': 'ADMIN',
  },
};

/** GET /nguoi-dung — danh sách + lọc + phân trang */
export const layDanhSachNguoiDung = (params = {}) =>
  httpClient.get('/nguoi-dung', { ...ADMIN_ROLE_CONFIG, params });

/** GET /nguoi-dung/tai-khoan-chua-lien-ket */
export const layDanhSachTaiKhoanChuaLienKet = (params = {}) =>
  httpClient.get('/nguoi-dung/tai-khoan-chua-lien-ket', { ...ADMIN_ROLE_CONFIG, params });

/** GET /nguoi-dung/:id */
export const layChiTietNguoiDung = (id) =>
  httpClient.get(`/nguoi-dung/${id}`, ADMIN_ROLE_CONFIG);

/** POST /nguoi-dung */
export const taoNguoiDung = (data) =>
  httpClient.post('/nguoi-dung', data, ADMIN_ROLE_CONFIG);

/** PATCH /nguoi-dung/:id */
export const capNhatNguoiDung = (id, data) =>
  httpClient.patch(`/nguoi-dung/${id}`, data, ADMIN_ROLE_CONFIG);

/** PATCH /nguoi-dung/:id/reset-password */
export const resetMatKhau = (id, data) =>
  httpClient.patch(`/nguoi-dung/${id}/reset-password`, data, ADMIN_ROLE_CONFIG);

/** PATCH /nguoi-dung/:id/toggle-lock */
export const toggleKhoaTaiKhoan = (id) =>
  httpClient.patch(`/nguoi-dung/${id}/toggle-lock`, {}, ADMIN_ROLE_CONFIG);

/** GET /bac-si — danh sach + tim kiem + loc + phan trang */
export const layDanhSachBacSi = (params = {}) =>
  httpClient.get('/bac-si', { ...ADMIN_ROLE_CONFIG, params });

/** GET /bac-si/tai-khoan */
export const layDanhSachTaiKhoanBacSi = (params = {}) =>
  httpClient.get('/bac-si/tai-khoan', { ...ADMIN_ROLE_CONFIG, params });

/** GET /bac-si/:id */
export const layChiTietBacSi = (id) =>
  httpClient.get(`/bac-si/${id}`, ADMIN_ROLE_CONFIG);

/** POST /bac-si */
export const taoBacSi = (data) =>
  httpClient.post('/bac-si', data, ADMIN_ROLE_CONFIG);

/** PUT /bac-si/:id */
export const capNhatBacSi = (id, data) =>
  httpClient.put(`/bac-si/${id}`, data, ADMIN_ROLE_CONFIG);

/** DELETE /bac-si/:id */
export const xoaBacSi = (id) =>
  httpClient.delete(`/bac-si/${id}`, ADMIN_ROLE_CONFIG);

/** GET /danh-muc/chuyen-khoa */
export const layDanhMucChuyenKhoa = (params = {}) =>
  httpClient.get('/danh-muc/chuyen-khoa', { ...ADMIN_ROLE_CONFIG, params });

/** GET /nhan-vien — danh sach + tim kiem + loc + phan trang */
export const layDanhSachNhanVien = (params = {}) =>
  httpClient.get('/nhan-vien', { ...ADMIN_ROLE_CONFIG, params });

/** GET /nhan-vien/tai-khoan */
export const layDanhSachTaiKhoanNhanVien = (params = {}) =>
  httpClient.get('/nhan-vien/tai-khoan', { ...ADMIN_ROLE_CONFIG, params });

/** GET /nhan-vien/:id */
export const layChiTietNhanVien = (id) =>
  httpClient.get(`/nhan-vien/${id}`, ADMIN_ROLE_CONFIG);

/** POST /nhan-vien */
export const taoNhanVien = (data) =>
  httpClient.post('/nhan-vien', data, ADMIN_ROLE_CONFIG);

/** PUT /nhan-vien/:id */
export const capNhatNhanVien = (id, data) =>
  httpClient.put(`/nhan-vien/${id}`, data, ADMIN_ROLE_CONFIG);

/** DELETE /nhan-vien/:id */
export const xoaNhanVien = (id) =>
  httpClient.delete(`/nhan-vien/${id}`, ADMIN_ROLE_CONFIG);

/** GET /vai-tro — danh sach + tim kiem + phan trang */
export const layDanhSachVaiTro = (params = {}) =>
  httpClient.get('/vai-tro', { ...ADMIN_ROLE_CONFIG, params });

/** GET /vai-tro/:id */
export const layChiTietVaiTro = (id) =>
  httpClient.get(`/vai-tro/${id}`, ADMIN_ROLE_CONFIG);

/** POST /vai-tro */
export const taoVaiTro = (data) =>
  httpClient.post('/vai-tro', data, ADMIN_ROLE_CONFIG);

/** PATCH /vai-tro/:id */
export const capNhatVaiTro = (id, data) =>
  httpClient.patch(`/vai-tro/${id}`, data, ADMIN_ROLE_CONFIG);

/** DELETE /vai-tro/:id */
export const xoaVaiTro = (id) =>
  httpClient.delete(`/vai-tro/${id}`, ADMIN_ROLE_CONFIG);

/** GET /quyen — danh sach + tim kiem + phan trang */
export const layDanhSachQuyen = (params = {}) =>
  httpClient.get('/quyen', { ...ADMIN_ROLE_CONFIG, params });

/** POST /quyen */
export const taoQuyen = (data) =>
  httpClient.post('/quyen', data, ADMIN_ROLE_CONFIG);

/** PATCH /quyen/:id */
export const capNhatQuyen = (id, data) =>
  httpClient.patch(`/quyen/${id}`, data, ADMIN_ROLE_CONFIG);

/** DELETE /quyen/:id */
export const xoaQuyen = (id) =>
  httpClient.delete(`/quyen/${id}`, ADMIN_ROLE_CONFIG);

/** POST /cloudinary/avatar/:nguoiDungId */
export const taiAnhDaiDienCloudinary = (nguoiDungId, file) => {
  const formData = new FormData();
  formData.append('hinh_anh', file);

  return httpClient.post(`/cloudinary/avatar/${nguoiDungId}`, formData, {
    ...ADMIN_ROLE_CONFIG,
    headers: {
      ...ADMIN_ROLE_CONFIG.headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

/** DELETE /cloudinary/avatar/:publicId */
export const xoaAnhDaiDienCloudinary = (publicId) =>
  httpClient.delete(`/cloudinary/avatar/${publicId}`, ADMIN_ROLE_CONFIG);

/** GET /cau-hinh-he-thong */
export const layDanhSachCauHinhHeThong = (params = {}) =>
  httpClient.get('/cau-hinh-he-thong', { ...ADMIN_ROLE_CONFIG, params });

/** PUT /cau-hinh-he-thong */
export const capNhatCauHinhHeThong = (data) =>
  httpClient.put('/cau-hinh-he-thong', data, ADMIN_ROLE_CONFIG);
