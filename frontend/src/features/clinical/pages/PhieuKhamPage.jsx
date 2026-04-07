import { Alert, Spin } from "antd";
import PatientCard from "../components/PatientCard";
import PhieuKhamHeaderCard from "../components/PhieuKhamHeaderCard";
import PhieuKhamVitalsSection from "../components/PhieuKhamVitalsSection";
import PhieuKhamClinicalNotesSection from "../components/PhieuKhamClinicalNotesSection";
import usePhieuKhamEditor, {
  formatPhieuKhamDateTime,
  formatPhieuKhamStatus,
} from "../hooks/usePhieuKhamEditor";

export default function PhieuKhamPage({ phieuKhamId, refreshKey = 0, onPhieuKhamChange }) {
  const {
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
  } = usePhieuKhamEditor({
    phieuKhamId,
    refreshKey,
    onPhieuKhamChange,
  });

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

  return (
    <div className="p-6" style={{ background: "#F8FAFC" }}>
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
          <PhieuKhamHeaderCard
            phieuKham={phieuKham}
            formatDateTime={formatPhieuKhamDateTime}
            formatStatus={formatPhieuKhamStatus}
          />

          <PhieuKhamVitalsSection data={formData} editable={isEditing} onChange={handleFieldChange} />

          <PhieuKhamClinicalNotesSection
            data={formData}
            sourceData={phieuKham}
            editable={isEditing}
            isSaving={saving}
            isLocked={isLocked}
            onChange={handleFieldChange}
            icd10Options={icd10Options}
            isLoadingIcd10={isLoadingIcd10}
            onSearchIcd10={loadIcd10Options}
            onSelectIcd10={handleIcd10Select}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}