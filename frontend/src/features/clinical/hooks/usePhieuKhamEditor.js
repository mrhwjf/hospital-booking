import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { getPhieuKham, searchIcd10, updatePhieuKham } from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";

function pickValue(incoming, fallback) {
  return incoming === undefined || incoming === null ? fallback : incoming;
}

function normalizePhieuKhamPayload(data = {}) {
  const rawPatient = data?.benh_nhan || {};
  const rawDoctor = data?.bac_si || {};

  return {
    ...data,
    benh_nhan: {
      ...rawPatient,
      id: rawPatient?.id,
      ho_ten: pickValue(rawPatient?.ho_ten, rawPatient?.ten),
      ma_benh_nhan: pickValue(rawPatient?.ma_benh_nhan, rawPatient?.ma),
      so_dien_thoai: pickValue(rawPatient?.so_dien_thoai, rawPatient?.sdt),
      tuoi: rawPatient?.tuoi,
      gioi_tinh: rawPatient?.gioi_tinh,
    },
    bac_si: {
      ...rawDoctor,
      id: rawDoctor?.id,
      ho_ten: pickValue(rawDoctor?.ho_ten, rawDoctor?.ten),
      ma_bac_si: pickValue(rawDoctor?.ma_bac_si, rawDoctor?.ma),
    },
    icd10_chinh: {
      ma_icd10: data?.icd10_chinh?.ma_icd10 ?? data?.ma_icd10_chinh ?? data?.ma_icd10 ?? null,
      ten_chan_doan: data?.icd10_chinh?.ten_chan_doan ?? null,
      nhom_chuong: data?.icd10_chinh?.nhom_chuong ?? null,
    },
    ma_icd10_chinh: pickValue(data?.ma_icd10_chinh, data?.ma_icd10),
  };
}

function mergePhieuKhamData(previousData, nextData) {
  const previous = previousData || {};
  const next = nextData || {};

  return {
    ...previous,
    ...next,
    benh_nhan: {
      ...(previous.benh_nhan || {}),
      ...(next.benh_nhan || {}),
    },
    bac_si: {
      ...(previous.bac_si || {}),
      ...(next.bac_si || {}),
    },
    lich_hen: {
      ...(previous.lich_hen || {}),
      ...(next.lich_hen || {}),
    },
  };
}

function createFormData(data) {
  return {
    mach: data?.mach ?? "",
    nhiet_do: data?.nhiet_do ?? "",
    huyet_ap: data?.huyet_ap ?? "",
    can_nang: data?.can_nang ?? "",
    chieu_cao: data?.chieu_cao ?? "",
    trieu_chung: data?.trieu_chung ?? "",
    ket_qua_kham: data?.ket_qua_kham ?? "",
    chan_doan: data?.chan_doan ?? "",
    ma_icd10_chinh: data?.ma_icd10_chinh ?? "",
    tinh_trang: data?.tinh_trang ?? "",
    huong_dieu_tri: data?.huong_dieu_tri ?? "",
    loi_dan: data?.loi_dan ?? "",
    hen_tai_kham: data?.hen_tai_kham ?? "",
    ghi_chu_noi_bo: data?.ghi_chu_noi_bo ?? "",
  };
}

function splitManualDiagnosis(currentDiagnosis, previousIcdBase) {
  const diagnosis = String(currentDiagnosis || "").trim();
  const previousBase = String(previousIcdBase || "").trim();

  if (!diagnosis) {
    return "";
  }

  if (!previousBase) {
    return diagnosis;
  }

  if (!diagnosis.toLowerCase().startsWith(previousBase.toLowerCase())) {
    return diagnosis;
  }

  let manual = diagnosis.slice(previousBase.length).trim();
  if (manual.startsWith("-")) {
    manual = manual.slice(1).trim();
  }

  return manual;
}

function combineDiagnosis(icdDiagnosis, manualDiagnosis) {
  const base = String(icdDiagnosis || "").trim();
  const manual = String(manualDiagnosis || "").trim();

  if (!base) {
    return manual;
  }

  if (!manual) {
    return base;
  }

  return `${base} - ${manual}`;
}

export function formatPhieuKhamDateTime(value) {
  if (!value) {
    return "Chưa có dữ liệu";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatPhieuKhamStatus(value) {
  const statusMap = {
    tiep_nhan: "Tiếp nhận",
    dang_kham: "Đang khám",
    hoan_thanh: "Hoàn thành",
  };

  return statusMap[value] || value || "Chưa có dữ liệu";
}

export default function usePhieuKhamEditor({ phieuKhamId, refreshKey = 0, onPhieuKhamChange }) {
  const [phieuKham, setPhieuKham] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [icd10Options, setIcd10Options] = useState([]);
  const [isLoadingIcd10, setIsLoadingIcd10] = useState(false);
  const [lastIcd10Base, setLastIcd10Base] = useState("");

  const loadIcd10Options = useCallback(async (keyword = "") => {
    setIsLoadingIcd10(true);

    try {
      const rows = await searchIcd10({ q: keyword, limit: 50 });
      setIcd10Options(
        (rows || []).map((row) => ({
          value: row.ma_icd10,
          label: row.label || `${row.nhom_chuong || ""} - ${row.ma_icd10} - ${row.ten_chan_doan}`,
          tenChanDoan: row.ten_chan_doan,
          nhomChuong: row.nhom_chuong,
        })),
      );
    } catch {
      setIcd10Options([]);
    } finally {
      setIsLoadingIcd10(false);
    }
  }, []);

  useEffect(() => {
    loadIcd10Options();
  }, [loadIcd10Options]);

  useEffect(() => {
    if (!phieuKhamId) {
      setPhieuKham(null);
      setFormData(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPhieuKham() {
      setLoading(true);
      setLoadError("");

      try {
        const data = await getPhieuKham(phieuKhamId);
        const normalized = normalizePhieuKhamPayload(data);

        if (isMounted) {
          setPhieuKham(normalized);
          setFormData(createFormData(normalized));
          setLastIcd10Base(normalized?.icd10_chinh?.ten_chan_doan || "");
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(getApiErrorMessage(error, "Không tải được dữ liệu phiếu khám."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPhieuKham();

    return () => {
      isMounted = false;
    };
  }, [phieuKhamId, refreshKey]);

  const isLocked = useMemo(() => phieuKham?.trang_thai === "hoan_thanh", [phieuKham?.trang_thai]);

  function handleFieldChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleIcd10Select(selectedCode) {
    const selectedOption = icd10Options.find((item) => item.value === selectedCode);
    const nextBase = selectedOption?.tenChanDoan || "";

    setFormData((prev) => {
      const manualPart = splitManualDiagnosis(prev?.chan_doan, lastIcd10Base);

      return {
        ...prev,
        ma_icd10_chinh: selectedCode || "",
        chan_doan: combineDiagnosis(nextBase, manualPart),
      };
    });

    setLastIcd10Base(nextBase);
  }

  function handleEditToggle() {
    if (isLocked) {
      return;
    }

    if (isEditing) {
      setFormData(createFormData(phieuKham));
      setLastIcd10Base(phieuKham?.icd10_chinh?.ten_chan_doan || "");
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  }

  async function handleSave() {
    if (!phieuKham || !formData) {
      return;
    }

    setSaving(true);
    setSaveError("");

    const bloodPressure = String(formData.huyet_ap || "").trim();
    if (bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(bloodPressure)) {
      setSaveError("Huyết áp phải theo định dạng <tâm thu>/<tâm trương>, ví dụ 120/80.");
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      huyet_ap: bloodPressure || null,
    };

    delete payload.trang_thai;

    try {
      const updated = await updatePhieuKham(phieuKham.id, payload);
      const normalizedUpdated = normalizePhieuKhamPayload(updated);
      const mergedPhieuKham = mergePhieuKhamData(phieuKham, normalizedUpdated);

      setPhieuKham(mergedPhieuKham);
      setFormData(createFormData(mergedPhieuKham));
      setLastIcd10Base(mergedPhieuKham?.icd10_chinh?.ten_chan_doan || lastIcd10Base);
      setIsEditing(false);

      if (typeof onPhieuKhamChange === "function") {
        onPhieuKhamChange(mergedPhieuKham);
      }

      message.success("Đã lưu phiếu khám thành công.");
    } catch (error) {
      setSaveError(getApiErrorMessage(error, "Không lưu được phiếu khám."));
    } finally {
      setSaving(false);
    }
  }

  return {
    phieuKham,
    formData,
    loading,
    saving,
    isEditing,
    loadError,
    saveError,
    isLocked,
    icd10Options,
    isLoadingIcd10,
    handleFieldChange,
    handleIcd10Select,
    loadIcd10Options,
    handleEditToggle,
    handleSave,
  };
}
