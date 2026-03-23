import httpClient from '../../api/httpClient';
import { CLINICAL_ENDPOINTS } from '../../api/clinicalApi';

const LOAI_LABEL = {
    xet_nghiem: 'Xét nghiệm',
    chan_doan_hinh_anh: 'Chẩn đoán hình ảnh',
    kham_benh: 'Khám bệnh',
    thu_thuat: 'Thủ thuật',
    phau_thuat: 'Phẫu thuật',
    khac: 'Khác',
};

/**
 * Lấy danh sách dịch vụ từ database.
 * @returns {Promise<object[]>}
 */
export async function getDichVuList() {
    const response = await httpClient.get(CLINICAL_ENDPOINTS.dichVuList());
    const items = response.data ?? [];

    return items.map((item) => ({
        id: item.id,
        name: item.ten_dich_vu,
        price: Number(item.gia_dich_vu ?? 0),
        category: LOAI_LABEL[item.loai_dich_vu] ?? 'Khác',
    }));
}

/**
 * Lấy danh sách chỉ định của một phiếu khám.
 * @param {number|string} phieuKhamId
 * @returns {Promise<object[]>}
 */
export async function getChiDinhList(phieuKhamId) {
    const response = await httpClient.get(CLINICAL_ENDPOINTS.chiDinhList(phieuKhamId));
    return response.data ?? [];
}

/**
 * Tạo danh sách chỉ định mới cho phiếu khám.
 * @param {number|string} phieuKhamId
 * @param {{ items: object[] }} payload
 * @returns {Promise<object|null>}
 */
export async function createChiDinh(phieuKhamId, payload) {
    const response = await httpClient.post(CLINICAL_ENDPOINTS.chiDinh(phieuKhamId), payload);
    return response.data ?? null;
}
