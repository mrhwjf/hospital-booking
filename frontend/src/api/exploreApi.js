import axios from 'axios'

const exploreHttpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api`,
  timeout: 15000,
})

const doctorsListCache = new Map()
const doctorDetailCache = new Map()
const specialtiesCache = new Map()

export async function fetchDoctors(params = {}) {
  const cacheKey = JSON.stringify(params || {})
  if (doctorsListCache.has(cacheKey)) {
    return doctorsListCache.get(cacheKey)
  }

  const response = await exploreHttpClient.get('/doctors', { params })
  doctorsListCache.set(cacheKey, response.data)
  return response.data
}

export async function fetchDoctorDetail(id) {
  const cacheKey = String(id)
  if (doctorDetailCache.has(cacheKey)) {
    return doctorDetailCache.get(cacheKey)
  }

  const response = await exploreHttpClient.get(`/doctors/${id}`)
  doctorDetailCache.set(cacheKey, response.data)
  return response.data
}

export async function fetchSpecialties(params = {}) {
  const cacheKey = JSON.stringify(params || {})
  if (specialtiesCache.has(cacheKey)) {
    return specialtiesCache.get(cacheKey)
  }

  const response = await exploreHttpClient.get('/specialties', { params })
  specialtiesCache.set(cacheKey, response.data)
  return response.data
}
