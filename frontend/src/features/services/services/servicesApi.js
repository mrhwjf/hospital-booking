import axios from 'axios'

const servicesHttpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api`,
  timeout: 15000,
})

const specialtiesCache = new Map()
const servicesCache = new Map()
const serviceDetailCache = new Map()

export async function getSpecialties() {
  const cacheKey = 'all'
  if (specialtiesCache.has(cacheKey)) {
    return specialtiesCache.get(cacheKey)
  }

  const response = await servicesHttpClient.get('/specialties')
  specialtiesCache.set(cacheKey, response.data)
  return response.data
}

export async function getServices(specialtyId) {
  const params = specialtyId ? { specialty_id: specialtyId } : {}
  const cacheKey = JSON.stringify(params)

  if (servicesCache.has(cacheKey)) {
    return servicesCache.get(cacheKey)
  }

  const response = await servicesHttpClient.get('/services', { params })
  servicesCache.set(cacheKey, response.data)
  return response.data
}

export async function getServiceById(id) {
  const cacheKey = String(id)
  if (serviceDetailCache.has(cacheKey)) {
    return serviceDetailCache.get(cacheKey)
  }

  const response = await servicesHttpClient.get(`/services/${id}`)
  serviceDetailCache.set(cacheKey, response.data)
  return response.data
}
