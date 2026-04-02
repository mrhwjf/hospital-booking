import httpClient from './httpClient';

// Đăng nhập
export const login = (email, mat_khau) => {
  return httpClient.post('/auth/login', {
    email,
    mat_khau,
  });
};
/**
 * Đăng ký bệnh nhân: trả về { token, nguoi_dung }
 */
export const register = (data) =>
  httpClient.post('/auth/register', data)
/**
 * Đăng xuất (huỷ token phía server)
 * // Xóa token khỏi localStorage
 */
export const logout = () => {
  clearToken(); // Xóa token khỏi localStorage
  return httpClient.post('/auth/logout');
};

/**
 * Lấy thông tin người dùng đang đăng nhập
 */
export const getMe = () => {
  return httpClient.get('/auth/me').then((response) => response?.data ?? response);
};

// Cập nhật thông tin tài khoản hiện tại
export const updateMe = (data) => {
  return httpClient.patch('/auth/me', data).then((response) => response?.data ?? response);
};
// Cập nhật avatar tài khoản hiện tại
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return httpClient.post('/auth/avatar', formData).then((response) => response?.data ?? response);
};
// Đổi mật khẩu tài khoản hiện tại
export const changePassword = (data) => {
  return httpClient.patch('/auth/change-password', data);
};

// Lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Xóa token khỏi localStorage
export const clearToken = () => {
  localStorage.removeItem('auth_token');
};






