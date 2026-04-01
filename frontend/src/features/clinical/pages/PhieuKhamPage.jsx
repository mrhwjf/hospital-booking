import { useEffect, useState } from "react";
import { Alert, Spin } from "antd";
import PatientCard from "../components/PatientCard";
import VitalSigns from "../components/VitalSigns";
import ClinicalNotes from "../components/ClinicalNotes";
import ClinicalActions from "../components/ClinicalActions";
import { getPhieuKham, updatePhieuKham } from "../../../Services/clinicalService";

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

function formatDateTime(value) {
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

function formatStatus(value) {
  const statusMap = {
    tiep_nhan: "Tiếp nhận",
    dang_kham: "Đang khám",
    cho_ke_don: "Chờ kê đơn",
    hoan_thanh: "Hoàn thành",
  };

  return statusMap[value] || value || "Chưa có dữ liệu";
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
    trang_thai: data?.trang_thai ?? "tiep_nhan",
  };
}

export default function PhieuKhamPage({ phieuKhamId, refreshKey = 0, onPhieuKhamChange }) {
  const [phieuKham, setPhieuKham] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

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
        }
      } catch (loadError) {
        if (isMounted) {
          setLoadError(loadError.response?.data?.message || "Không tải được dữ liệu phiếu khám.");
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

  const isLocked = phieuKham?.trang_thai === "hoan_thanh";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <Spin size="large" tip="Đang tải phiếu khám..." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        <Alert
          message="Không tải được phiếu khám"
          description={loadError}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!phieuKham) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        <Alert message="Không tìm thấy dữ liệu phiếu khám." type="warning" showIcon />
      </div>
    );
  }

  function handleFieldChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleEditToggle() {
    if (isLocked) {
      return;
    }

    if (isEditing) {
      setFormData(createFormData(phieuKham));
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

    try {
      const updated = await updatePhieuKham(phieuKham.id, formData);
      const normalizedUpdated = normalizePhieuKhamPayload(updated);
      const mergedPhieuKham = mergePhieuKhamData(phieuKham, normalizedUpdated);
      setPhieuKham(mergedPhieuKham);
      setFormData(createFormData(mergePhieuKhamData(formData, normalizedUpdated)));
      setIsEditing(false);
      if (typeof onPhieuKhamChange === "function") {
        onPhieuKhamChange(mergedPhieuKham);
      }
      alert("Đã lưu phiếu khám thành công.");
    } catch (saveError) {
      setSaveError(saveError.response?.data?.message || "Không lưu được phiếu khám.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#0F172A" }}>
        Phiếu Khám Bệnh
      </h1>

      {saveError && (
        <div className="mb-4">
          <Alert message="Không lưu được phiếu khám" description={saveError} type="error" showIcon />
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4">
          <div
            className="bg-white rounded-[10px] p-5"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px 0 rgba(15,118,110,0.06)" }}
          >
            <PatientCard patient={phieuKham.benh_nhan} appointment={phieuKham.lich_hen} />
          </div>
        </div>

        <div className="col-span-8 flex flex-col gap-2">
          <div className="bg-white rounded-[10px] p-4 mb-3 flex items-center justify-between" style={{ border: "1px solid #E2E8F0" }}>
            <div>
              <div className="text-sm text-gray-500">Mã phiếu</div>
              <div className="font-semibold text-[#0F172A]">{phieuKham.ma_phieu_kham || `#${phieuKham.id}`}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Người tạo</div>
              <div className="text-sm">{phieuKham.nguoi_tao?.email || `ID ${phieuKham.nguoi_tao_id || "-"}`}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Thời gian tiếp nhận</div>
              <div className="text-sm">{formatDateTime(phieuKham.thoi_gian_tiep_nhan)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Trạng thái</div>
              {isEditing ? (
                <select
                  className="p-2 border rounded text-sm min-w-[140px]"
                  value={formData?.trang_thai || "tiep_nhan"}
                  onChange={(event) => handleFieldChange("trang_thai", event.target.value)}
                  disabled={isLocked}
                >
                  <option value="tiep_nhan">Tiếp nhận</option>
                  <option value="dang_kham">Đang khám</option>
                  <option value="cho_ke_don">Chờ kê đơn</option>
                  <option value="hoan_thanh">Hoàn thành</option>
                </select>
              ) : (
                <div className="text-sm font-medium text-[#0F172A]">{formatStatus(phieuKham.trang_thai)}</div>
              )}
            </div>
          </div>

          <div>
            <VitalSigns data={formData} editable={isEditing} onChange={handleFieldChange} />
          </div>

          <div
            className="bg-white rounded-[10px] px-0 py-5"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px 0 rgba(15,118,110,0.06)" }}
          >
            <ClinicalNotes data={formData} editable={isEditing} onChange={handleFieldChange} sourceData={phieuKham} />
            <ClinicalActions
              type="phieu-kham"
              isEditing={isEditing}
              isSaving={saving}
              onEdit={handleEditToggle}
              onSubmit={handleSave}
              disabled={!isEditing || saving || isLocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}