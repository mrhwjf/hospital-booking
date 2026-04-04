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

export async function completePhieuKham(id) {
  return updatePhieuKham(id, { trang_thai: "hoan_thanh" });
}

export async function getDichVuList() {
  const response = await httpClient.get(CLINICAL_ENDPOINTS.dichVuList());
  const items = response?.data ?? [];

  return items.map((item) => ({
    id: item.id,
    name: item.ten_dich_vu,
    price: Number(item.gia_dich_vu ?? 0),
    category: LOAI_LABEL[item.loai_dich_vu] ?? "Khác",
  }));
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
