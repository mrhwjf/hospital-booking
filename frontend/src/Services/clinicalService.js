import httpClient from "../api/httpClient";
import { CLINICAL_ENDPOINTS } from "../api/clinicalApi";
import { PATIENT_ENDPOINTS } from "../api/patientApi";

const LOAI_LABEL = {
  xet_nghiem: "Xét nghiệm",
  chan_doan_hinh_anh: "Chẩn đoán hình ảnh",
  kham_benh: "Khám bệnh",
  thu_thuat: "Thủ thuật",
  phau_thuat: "Phẫu thuật",
  khac: "Khác",
};

export async function getPhieuKhamList(params = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.phieuKhamList(), { params });
  return response?.data ?? [];
}

export async function getPhieuKham(id) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.phieuKham(id));
  return response?.data ?? null;
}

export async function updatePhieuKham(id, payload) {
  const response = await httpClient.put(CLINICAL_ENDPOINTS.phieuKham(id), payload);
  return response?.data ?? null;
}

export async function startPhieuKham(id) {
  const response = await httpClient.post(CLINICAL_ENDPOINTS.startPhieuKham(id));
  return response?.data ?? null;
}

export async function completePhieuKham(id) {
  const response = await httpClient.post(CLINICAL_ENDPOINTS.completePhieuKham(id));
  return response?.data ?? null;
}

export async function searchIcd10(params = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.icd10List(), { params });
  return response?.data ?? [];
}

function normalizeChiDinhCatalogItem(item = {}) {
  const sourceType = item?.loai_nguon === "goi_kham" ? "goi_kham" : "dich_vu";
  const isPackage = sourceType === "goi_kham";
  const entityId = Number(
    isPackage
      ? (item?.goi_kham_id ?? item?.id)
      : (item?.dich_vu_id ?? item?.id),
  );

  if (!Number.isFinite(entityId) || entityId <= 0) {
    return null;
  }

  const specialties = Array.isArray(item?.chuyen_khoa)
    ? item.chuyen_khoa
    : item?.chuyen_khoa
      ? [item.chuyen_khoa]
      : [];

  const specialtyIds = specialties
    .map((specialty) => Number(specialty?.id))
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    key: `${sourceType}:${entityId}`,
    id: entityId,
    entityId,
    type: sourceType,
    code: isPackage ? (item?.ma_goi_kham || "") : (item?.ma_dich_vu || ""),
    name: isPackage
      ? (item?.ten_goi_kham || `Gói khám #${entityId}`)
      : (item?.ten_dich_vu || `Dịch vụ #${entityId}`),
    price: Number(isPackage ? (item?.gia_goi_kham ?? 0) : (item?.gia_dich_vu ?? 0)),
    category: isPackage ? "Gói khám" : (LOAI_LABEL[item?.loai_dich_vu] ?? "Khác"),
    specialtyId: specialtyIds[0] ?? (Number(item?.chuyen_khoa_id) || null),
    specialtyIds,
    specialtyName: specialties
      .map((specialty) => specialty?.ten_chuyen_khoa)
      .filter(Boolean)
      .join(", "),
    dichVuId: isPackage ? null : entityId,
    goiKhamId: isPackage ? entityId : null,
  };
}

export async function getDichVuList(params = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.dichVuList(), { params });
  const items = response?.data ?? [];

  return items
    .map(normalizeChiDinhCatalogItem)
    .filter(Boolean);
}

export async function getChiDinhList(phieuKhamId) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.chiDinhList(phieuKhamId));
  return response?.data ?? [];
}

export async function createChiDinh(phieuKhamId, payload) {
  const response = await httpClient.post(CLINICAL_ENDPOINTS.chiDinh(phieuKhamId), payload);
  return response?.data ?? [];
}

export async function getDonThuocByPhieuKham(phieuKhamId) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.donThuocByPhieuKham(phieuKhamId));
  return response?.data ?? null;
}

export async function createDonThuoc(phieuKhamId, payload) {
  const response = await httpClient.post(CLINICAL_ENDPOINTS.createDonThuoc(phieuKhamId), payload);
  return response?.data ?? null;
}

export async function addDonThuocItems(donThuocId, payload) {
  const response = await httpClient.post(CLINICAL_ENDPOINTS.donThuocItems(donThuocId), payload);
  return response?.data ?? null;
}

export async function updateDonThuocItems(donThuocId, payload) {
  const response = await httpClient.put(CLINICAL_ENDPOINTS.donThuocItems(donThuocId), payload);
  return response?.data ?? null;
}

export async function deleteDonThuoc(donThuocId) {
  const response = await httpClient.delete(CLINICAL_ENDPOINTS.donThuoc(donThuocId));
  return response?.data ?? null;
}

export async function searchThuoc(params = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.thuocList(), { params });
  return response?.data ?? [];
}

export async function getThongTinBacSiStatic(params = {}, config = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.thongTinBacSi(), { params, ...config });
  return response;
}

export async function getThongTinBacSiWeekly(params = {}, config = {}) {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.lichLamViecBacSi(), { params, ...config });
  return response;
}

export async function getLichSuPhieuKham(benhNhanId, params = {}) {
  const result = await httpClient.get(PATIENT_ENDPOINTS.lichSuPhieuKham(benhNhanId), { params });
  return result?.data?.items ?? result?.data ?? [];
}

export async function getHoSoTaiLieuByBenhNhan(benhNhanId, params = {}) {
  const result = await httpClient.get(PATIENT_ENDPOINTS.taiLieuHoSo(benhNhanId), { params });
  return result?.data?.items ?? result?.data ?? [];
}

export async function createHoSoTaiLieu(benhNhanId, payload) {
  const result = await httpClient.post(PATIENT_ENDPOINTS.taiLieuHoSo(benhNhanId), payload);
  return result?.data ?? null;
}

export async function updateHoSoTaiLieu(benhNhanId, taiLieuId, payload) {
  const result = await httpClient.put(PATIENT_ENDPOINTS.taiLieuHoSoById(benhNhanId, taiLieuId), payload);
  return result?.data ?? null;
}

export async function uploadHoSoTaiLieuFile(benhNhanId, taiLieuId, file) {
  const formData = new FormData();
  formData.append("tai_lieu", file);

  const result = await httpClient.post(PATIENT_ENDPOINTS.taiLieuHoSoUpload(benhNhanId, taiLieuId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return result?.data ?? null;
}

export async function getTaiLieuSignedUrl(benhNhanId, taiLieuId) {
  const result = await httpClient.get(PATIENT_ENDPOINTS.taiLieuHoSoSignedUrl(benhNhanId, taiLieuId));
  return result?.data?.url ?? null;
}

export async function deleteHoSoTaiLieu(benhNhanId, taiLieuId) {
  const result = await httpClient.delete(PATIENT_ENDPOINTS.taiLieuHoSoById(benhNhanId, taiLieuId));
  return result?.data ?? null;
}
