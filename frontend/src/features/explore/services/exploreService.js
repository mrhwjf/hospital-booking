import { fetchDoctorDetail, fetchDoctors, fetchSpecialties } from '../../../api/exploreApi'

export async function getDoctors(filters = {}) {
  const payload = await fetchDoctors(filters)

  return {
    data: payload?.data || [],
    meta: payload?.meta || {},
  }
}

export async function getDoctorById(id) {
  const payload = await fetchDoctorDetail(id)

  return payload?.data || payload
}

export async function getSpecialties(filters = {}) {
  const payload = await fetchSpecialties(filters)

  return {
    data: payload?.data || [],
    meta: payload?.meta || {},
  }
}
