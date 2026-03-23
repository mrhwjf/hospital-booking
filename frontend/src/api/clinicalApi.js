// Cấu hình endpoint URLs cho clinical API.
// Các hàm giao tiếp thực tế nằm trong src/Services/clinicals/

export const CLINICAL_ENDPOINTS = {
    // Phiếu khám
    phieuKham:    (id)           => `/phieu-kham/${id}`,

    // Danh sách dịch vụ khám
    dichVuList:   ()             => `/dich-vu`,

    // Chỉ định dịch vụ
    chiDinhList:  (phieuKhamId)  => `/phieu-kham/${phieuKhamId}/chi-dinh`,
    chiDinh:      (phieuKhamId)  => `/phieu-kham/${phieuKhamId}/chi-dinh`,
};
