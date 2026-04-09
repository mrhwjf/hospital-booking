import axios from 'axios'
import { getStoredAuthToken } from '../../../utils/userProfileSync'

const servicesHttpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api`,
  timeout: 15000,
})

const catalogHttpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1`,
  timeout: 15000,
})

catalogHttpClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const specialtiesCache = new Map()
const servicesCache = new Map()
const serviceDetailCache = new Map()

function toNumberOrNull(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeStandaloneServiceItem(item) {
  const specialtyId = item?.chuyen_khoa?.id ?? item?.chuyen_khoa_id ?? null
  const specialtyName = item?.chuyen_khoa?.ten_chuyen_khoa ?? item?.specialty_name ?? null

  return {
    id: item?.id,
    catalog_type: 'dich_vu',
    code: item?.ma_dich_vu,
    name: item?.ten_dich_vu,
    description_short: item?.mo_ta || '',
    description_full: item?.mo_ta || '',
    price: toNumberOrNull(item?.gia_dich_vu),
    duration: toNumberOrNull(item?.thoi_gian_du_kien),
    service_type: item?.loai_dich_vu || 'dich_vu',
    status: item?.trang_thai,
    specialty_id: specialtyId,
    specialty_name: specialtyName,
    special_requirements: item?.yeu_cau_dac_biet || null,
    requirements: item?.yeu_cau_dac_biet ? [item.yeu_cau_dac_biet] : [],
    included_services: [],
  }
}

function normalizePublicPackageListItem(item) {
  const normalized = normalizePackageDetail(item)

  return {
    ...normalized,
    id: item?.id,
    catalog_type: 'goi_kham',
    code: item?.code,
    name: item?.name,
    status: item?.status,
    service_type: 'goi_kham',
    specialty_id: item?.specialty_id ?? normalized.specialty_id,
    specialty_name: item?.specialty_name ?? normalized.specialty_name,
    special_requirements:
      normalized.special_requirements ||
      (Array.isArray(item?.requirements) ? item.requirements.join('\n') : null),
    total_base_price:
      normalized.total_base_price ?? toNumberOrNull(item?.stats?.total_included_services_price),
  }
}

function normalizePackageDetail(item) {
  const normalizedIncluded = Array.isArray(item?.included_services)
    ? item.included_services.map((service) => ({
      ...service,
      service_type: service?.service_type || 'dich_vu',
      duration: toNumberOrNull(service?.duration),
      price: toNumberOrNull(service?.price),
      specialty: {
        id: service?.specialty?.id ?? null,
        name: service?.specialty?.name ?? null,
      },
    }))
    : []

  const primarySpecialty = normalizedIncluded.find((service) => service?.specialty?.id)?.specialty

  return {
    ...item,
    id: item?.id,
    catalog_type: 'goi_kham',
    service_type: 'goi_kham',
    code: item?.code,
    name: item?.name,
    description_short: item?.description_short || item?.description_full || '',
    description_full: item?.description_full || item?.description_short || '',
    price: toNumberOrNull(item?.price),
    duration: toNumberOrNull(item?.duration),
    status: item?.status,
    specialty_id: item?.specialty_id ?? primarySpecialty?.id ?? null,
    specialty_name: item?.specialty_name ?? primarySpecialty?.name ?? null,
    special_requirements:
      item?.special_requirements ||
      (Array.isArray(item?.requirements) ? item.requirements.join('\n') : null),
    included_services: normalizedIncluded,
    total_base_price:
      toNumberOrNull(item?.total_base_price) ??
      toNumberOrNull(item?.stats?.total_included_services_price),
  }
}

async function fetchAllCatalogPages(endpoint, params = {}) {
  const items = []
  let page = 1

  while (true) {
    const response = await catalogHttpClient.get(endpoint, {
      params: {
        ...params,
        page,
        pageSize: 100,
      },
    })

    const payload = response?.data?.data || {}
    const pageItems = Array.isArray(payload?.items) ? payload.items : []
    const pagination = payload?.pagination || null

    items.push(...pageItems)

    const totalPages = Number(pagination?.totalPages || 1)
    if (page >= totalPages) {
      break
    }

    page += 1
  }

  return items
}

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

  const packageResponse = await servicesHttpClient.get('/services', { params })
  const packageItems = Array.isArray(packageResponse?.data?.data)
    ? packageResponse.data.data
    : []

  let normalizedStandaloneServices = []
  try {
    const standaloneServices = await fetchAllCatalogPages('/dich-vu',
      specialtyId ? { chuyen_khoa_id: specialtyId } : {},
    )
    normalizedStandaloneServices = standaloneServices.map(normalizeStandaloneServiceItem)
  } catch (error) {
    const status = Number(error?.response?.status || 0)
    if (status !== 401 && status !== 403) {
      throw error
    }
  }

  const normalizedPackages = packageItems.map(normalizePublicPackageListItem)

  const combined = [...normalizedStandaloneServices, ...normalizedPackages].sort((first, second) =>
    String(first?.name || '').localeCompare(String(second?.name || ''), 'vi'),
  )

  const result = {
    success: true,
    data: combined,
  }

  servicesCache.set(cacheKey, result)
  return result
}

export async function getServiceById(id, type = 'goi_kham') {
  const normalizedType = type === 'dich_vu' ? 'dich_vu' : 'goi_kham'
  const cacheKey = `${normalizedType}:${String(id)}`

  if (serviceDetailCache.has(cacheKey)) {
    return serviceDetailCache.get(cacheKey)
  }

  if (normalizedType === 'dich_vu') {
    const standaloneServices = await fetchAllCatalogPages('/dich-vu')
    const matched = standaloneServices.find((item) => Number(item?.id) === Number(id))

    if (!matched) {
      throw new Error('Không tìm thấy dịch vụ.')
    }

    const result = {
      success: true,
      data: normalizeStandaloneServiceItem(matched),
    }

    serviceDetailCache.set(cacheKey, result)
    return result
  }

  const response = await servicesHttpClient.get(`/services/${id}`)
  const payload = response?.data?.data || response?.data || null

  const result = {
    success: true,
    data: normalizePackageDetail(payload),
  }

  serviceDetailCache.set(cacheKey, result)
  return result
}
