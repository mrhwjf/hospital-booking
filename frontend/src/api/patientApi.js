// Cấu hình endpoint URLs cho patient API.

export const PATIENT_ENDPOINTS = {
    lichSuPhieuKham: (benhNhanId) => `/patients/${benhNhanId}/lich-su-phieu-kham`,
    taiLieuHoSo: (benhNhanId) => `/patients/${benhNhanId}/tai-lieu-ho-so`,
    taiLieuHoSoById: (benhNhanId, taiLieuId) => `/patients/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}`,
    taiLieuHoSoUpload: (benhNhanId, taiLieuId) => `/patients/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/upload`,
    taiLieuHoSoSignedUrl: (benhNhanId, taiLieuId) => `/patients/${benhNhanId}/tai-lieu-ho-so/${taiLieuId}/signed-url`,
};
