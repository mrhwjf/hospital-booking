import axios from 'axios'


const httpClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 15000,
})

// Request interceptor - Thêm authorization token
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Giữ response structure từ Laravel
httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
)


export default httpClient