import httpClient from './httpClient';

// Đăng nhập
export const login = (email, mat_khau) => {
  return httpClient.post('/auth/login', {
    email,
    mat_khau,
  });
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem('token');
  return httpClient.post('/auth/logout');
};

// Lấy thông tin user hiện tại
export const getMe = () => {
  return httpClient.get('/auth/me');
};

// Lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Xóa token
export const clearToken = () => {
  localStorage.removeItem('token');
};