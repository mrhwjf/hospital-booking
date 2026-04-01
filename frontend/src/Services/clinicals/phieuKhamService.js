import httpClient from '../../api/httpClient';
import { CLINICAL_ENDPOINTS } from '../../api/clinicalApi';

/**
 * Lấy chi tiết phiếu khám theo ID.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
export async function getPhieuKham(id) {
    const response = await httpClient.get(CLINICAL_ENDPOINTS.phieuKham(id));
    return response.data ?? null;
}

/**
 * Cập nhật phiếu khám theo ID.
 * @param {number|string} id
 * @param {object} payload
 * @returns {Promise<object|null>}
 */
export async function updatePhieuKham(id, payload) {
    const response = await httpClient.put(CLINICAL_ENDPOINTS.phieuKham(id), payload);
    return response.data ?? null;
}
