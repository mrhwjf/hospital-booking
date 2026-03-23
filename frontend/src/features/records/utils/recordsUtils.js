import { DOCUMENT_TYPE_OPTIONS, PHIEU_KHAM_OPTIONS } from "../data/recordsData";

export function formatDate(value) {
  if (!value) {
    return "Chưa cập nhật";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getDocumentTypeMeta(value) {
  return DOCUMENT_TYPE_OPTIONS.find((item) => item.value === value) || DOCUMENT_TYPE_OPTIONS[DOCUMENT_TYPE_OPTIONS.length - 1];
}

export function buildDocumentView(document) {
  const relatedPhieuKham = PHIEU_KHAM_OPTIONS.find((item) => item.id === document.phieu_kham_id);

  return {
    ...document,
    phieu_kham: relatedPhieuKham,
    benh_nhan: relatedPhieuKham?.benh_nhan,
  };
}