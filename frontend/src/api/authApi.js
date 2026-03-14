import httpClient from './httpClient'

/**
 * Đăng nhập: trả về { token, nguoi_dung }
 */
export const login = (email, matKhau) =>
    httpClient.post('/auth/login', { email, mat_khau: matKhau })

/**
 * Đăng ký bệnh nhân: trả về { token, nguoi_dung }
 */
export const register = (data) =>
    httpClient.post('/auth/register', data)

/**
 * Đăng xuất (huỷ token phía server)
 */
export const logout = () =>
    httpClient.post('/auth/logout')

/**
 * Lấy thông tin người dùng đang đăng nhập
 */
export const getMe = () =>
    httpClient.get('/auth/me')
