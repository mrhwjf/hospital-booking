import axios from 'axios'


const httpClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 15000,
})


httpClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
)


export default httpClient