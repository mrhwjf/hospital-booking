import httpClient from './httpClient';

/** GET /nguoi-dung — danh sách + lọc + phân trang */
export const layDanhSachNguoiDung = (params = {}) =>
  httpClient.get('/nguoi-dung', { params });

/** GET /nguoi-dung/tai-khoan-chua-lien-ket */
export const layDanhSachTaiKhoanChuaLienKet = (params = {}) =>
  httpClient.get('/nguoi-dung/tai-khoan-chua-lien-ket', { params });

/** GET /nguoi-dung/:id */
export const layChiTietNguoiDung = (id) =>
  httpClient.get(`/nguoi-dung/${id}`);

/** POST /nguoi-dung */
export const taoNguoiDung = (data) =>
  httpClient.post('/nguoi-dung', data);

/** PATCH /nguoi-dung/:id */
export const capNhatNguoiDung = (id, data) =>
  httpClient.patch(`/nguoi-dung/${id}`, data);

/** PATCH /nguoi-dung/:id/reset-password */
export const resetMatKhau = (id, data) =>
  httpClient.patch(`/nguoi-dung/${id}/reset-password`, data);

/** PATCH /nguoi-dung/:id/toggle-lock */
export const toggleKhoaTaiKhoan = (id) =>
  httpClient.patch(`/nguoi-dung/${id}/toggle-lock`, {});

/** GET /bac-si — danh sach + tim kiem + loc + phan trang */
export const layDanhSachBacSi = (params = {}) =>
  httpClient.get('/bac-si', { params });

/** GET /bac-si/tai-khoan */
export const layDanhSachTaiKhoanBacSi = (params = {}) =>
  httpClient.get('/bac-si/tai-khoan', { params });

/** GET /bac-si/:id */
export const layChiTietBacSi = (id) =>
  httpClient.get(`/bac-si/${id}`);

/** POST /bac-si */
export const taoBacSi = (data) =>
  httpClient.post('/bac-si', data);

/** PUT /bac-si/:id */
export const capNhatBacSi = (id, data) =>
  httpClient.put(`/bac-si/${id}`, data);

/** DELETE /bac-si/:id */
export const xoaBacSi = (id) =>
  httpClient.delete(`/bac-si/${id}`);

/** GET /danh-muc/chuyen-khoa */
export const layDanhMucChuyenKhoa = (params = {}) =>
  httpClient.get('/danh-muc/chuyen-khoa', { params });

/** GET /nhan-vien — danh sach + tim kiem + loc + phan trang */
export const layDanhSachNhanVien = (params = {}) =>
  httpClient.get('/nhan-vien', { params });

/** GET /nhan-vien/tai-khoan */
export const layDanhSachTaiKhoanNhanVien = (params = {}) =>
  httpClient.get('/nhan-vien/tai-khoan', { params });

/** GET /nhan-vien/:id */
export const layChiTietNhanVien = (id) =>
  httpClient.get(`/nhan-vien/${id}`);

/** POST /nhan-vien */
export const taoNhanVien = (data) =>
  httpClient.post('/nhan-vien', data);

/** PUT /nhan-vien/:id */
export const capNhatNhanVien = (id, data) =>
  httpClient.put(`/nhan-vien/${id}`, data);

/** DELETE /nhan-vien/:id */
export const xoaNhanVien = (id) =>
  httpClient.delete(`/nhan-vien/${id}`);

/** GET /vai-tro — danh sach + tim kiem + phan trang */
export const layDanhSachVaiTro = (params = {}) =>
  httpClient.get('/vai-tro', { params });

/** GET /vai-tro/:id */
export const layChiTietVaiTro = (id) =>
  httpClient.get(`/vai-tro/${id}`);

/** POST /vai-tro */
export const taoVaiTro = (data) =>
  httpClient.post('/vai-tro', data);

/** PATCH /vai-tro/:id */
export const capNhatVaiTro = (id, data) =>
  httpClient.patch(`/vai-tro/${id}`, data);

/** DELETE /vai-tro/:id */
export const xoaVaiTro = (id) =>
  httpClient.delete(`/vai-tro/${id}`);

/** GET /quyen — danh sach + tim kiem + phan trang */
export const layDanhSachQuyen = (params = {}) =>
  httpClient.get('/quyen', { params });

/** POST /quyen */
export const taoQuyen = (data) =>
  httpClient.post('/quyen', data);

/** PATCH /quyen/:id */
export const capNhatQuyen = (id, data) =>
  httpClient.patch(`/quyen/${id}`, data);

/** DELETE /quyen/:id */
export const xoaQuyen = (id) =>
  httpClient.delete(`/quyen/${id}`);

/** POST /cloudinary/avatar/:nguoiDungId */
export const taiAnhDaiDienCloudinary = (nguoiDungId, file) => {
  const formData = new FormData();
  formData.append('hinh_anh', file);

  return httpClient.post(`/cloudinary/avatar/${nguoiDungId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/** DELETE /cloudinary/avatar/:publicId */
export const xoaAnhDaiDienCloudinary = (publicId) =>
  httpClient.delete(`/cloudinary/avatar/${publicId}`);

/** GET /cau-hinh-he-thong */
export const layDanhSachCauHinhHeThong = (params = {}) =>
  httpClient.get('/cau-hinh-he-thong', { params });

/** PUT /cau-hinh-he-thong */
export const capNhatCauHinhHeThong = (data) =>
  httpClient.put('/cau-hinh-he-thong', data);
