import axios from 'axios'

const httpClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 15000,
})

// Request interceptor - Thêm authorization token
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Trả về response.data để đơn giản
httpClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
)


export default httpClient
