import httpClient from '../../api/httpClient';
import { PATIENT_ENDPOINTS } from '../../api/patientApi';

/**
 * Lấy danh sách hồ sơ tài liệu theo bệnh nhân.
 * @param {number|string} benhNhanId
 * @param {object} params - { keyword, loai_tai_lieu, per_page }
 * @returns {Promise<Array>}
 */
export async function getHoSoTaiLieuByBenhNhan(benhNhanId, params = {}) {
  const result = await httpClient.get(PATIENT_ENDPOINTS.taiLieuHoSo(benhNhanId), { params });
  return result?.data?.items ?? result?.data ?? [];
}

export async function createHoSoTaiLieu(benhNhanId, payload) {
  const result = await httpClient.post(PATIENT_ENDPOINTS.taiLieuHoSo(benhNhanId), payload);
  return result.data;
}

export async function updateHoSoTaiLieu(benhNhanId, taiLieuId, payload) {
  const result = await httpClient.put(PATIENT_ENDPOINTS.taiLieuHoSoById(benhNhanId, taiLieuId), payload);
  return result.data;
}

export async function uploadHoSoTaiLieuFile(benhNhanId, taiLieuId, file) {
  const formData = new FormData();
  formData.append('tai_lieu', file);

  const result = await httpClient.post(PATIENT_ENDPOINTS.taiLieuHoSoUpload(benhNhanId, taiLieuId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return result.data;
}

export async function getTaiLieuSignedUrl(benhNhanId, taiLieuId) {
  const result = await httpClient.get(PATIENT_ENDPOINTS.taiLieuHoSoSignedUrl(benhNhanId, taiLieuId));
  return result.data?.url ?? null;
}

export async function deleteHoSoTaiLieu(benhNhanId, taiLieuId) {
  await httpClient.delete(PATIENT_ENDPOINTS.taiLieuHoSoById(benhNhanId, taiLieuId));
}
