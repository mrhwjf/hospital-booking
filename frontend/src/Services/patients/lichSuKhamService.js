import httpClient from '../../api/httpClient';
import { PATIENT_ENDPOINTS } from '../../api/patientApi';

/**
 * Lấy lịch sử phiếu khám của một bệnh nhân.
 * @param {number|string} benhNhanId
 * @param {object} params - { per_page, tu_ngay, den_ngay, trang_thai }
 * @returns {Promise<Array>}
 */
export async function getLichSuPhieuKham(benhNhanId, params = {}) {
    const result = await httpClient.get(PATIENT_ENDPOINTS.lichSuPhieuKham(benhNhanId), { params });
    return result.data ?? [];
}
