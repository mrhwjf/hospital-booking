import {
  ConfigProvider,
} from "antd";
import {
  MedicineBoxOutlined,
} from "@ant-design/icons";
import DonThuocDraftForm from "../components/DonThuocDraftForm";
import DonThuocItemsTable from "../components/DonThuocItemsTable";
import DonThuocFooterActions from "../components/DonThuocFooterActions";
import useDonThuocEditor, { TIME_OPTIONS } from "../hooks/useDonThuocEditor";

const PRIMARY = "#1c7a71";
const DEFAULT_PHIEU_KHAM_ID = null;

export default function DonThuocPage({ phieuKhamId = DEFAULT_PHIEU_KHAM_ID, isLocked = false, refreshKey = 0 }) {
  const {
    prescriptions,
    medicineOptions,
    draftPrescription,
    editingId,
    isSaving,
    isLoadingMedicines,
    updateDraft,
    updateMedicineDraft,
    cancelEdit,
    startEditRow,
    removeRow,
    submitPrescriptionFromDraft,
    handleDeletePrescription,
    savePrescription,
  } = useDonThuocEditor({
    phieuKhamId,
    isLocked,
    refreshKey,
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY,
          borderRadius: 10,
          controlHeight: 42,
          fontSize: 15,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{ background: "#f8fbfb" }}
      >
        {/* ── Top Navbar ── */}
        {/* <header
          className="flex items-center justify-between px-6 h-16 shrink-0 shadow-sm"
          style={{ background: "#fff", borderBottom: "1px solid #e8f3f2" }}
        >
          <h2 className="text-lg font-bold" style={{ color: "#0e1b1a" }}>
            Phiếu khám bệnh
          </h2>
        </header> */}

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-6">
          <div className="max-w-350 mx-auto flex flex-col gap-6">

            {/* Patient profile card */}
            {/* <div
              className="rounded-xl p-5 shadow-sm"
              style={{ background: "#fff", border: "1px solid #e8f3f2" }}
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                <div className="flex gap-5 items-center">
                  <img
                    src={patient.avatar}
                    alt="Ảnh bệnh nhân"
                    className="h-20 w-20 rounded-full object-cover shrink-0"
                    style={{ border: "4px solid #f9fafb" }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#0e1b1a" }}
                      >
                        {patient.name}
                      </span>
                      <Tag
                        color="success"
                        className="rounded-full font-semibold"
                      >
                        {patient.status}
                      </Tag>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      <span>
                        {patient.gender} • {patient.age} Tuổi
                      </span>
                      <span>ID: {patient.patientId}</span>
                      <span>
                        BHYT: {patient.insurance} ({patient.insurancePct}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    icon={<FileTextOutlined />}
                    style={{
                      color: PRIMARY,
                      background: `${PRIMARY}1a`,
                      border: "none",
                    }}
                  >
                    LS Bệnh án
                  </Button>
                  <Button icon={<EditOutlined />}>Ghi chú</Button>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col">
              <div
                className="rounded-xl shadow-sm flex flex-col flex-1"
                style={{ background: "#fff", border: "1px solid #e8f3f2" }}
              >


                {/* Header */}
                <div
                  className="px-5 py-4 flex justify-between items-center"
                  style={{ borderBottom: "1px solid #e8f3f2" }}
                >
                  <h3
                    className="font-bold text-lg flex items-center gap-2"
                    style={{ color: "#0e1b1a" }}
                  >
                    <MedicineBoxOutlined style={{ color: PRIMARY }} />
                    Kê đơn thuốc
                  </h3>

                </div>

                {/* Prescription rows */}
                <div className="p-5 flex-1 overflow-auto">
                  <DonThuocDraftForm
                    draftPrescription={draftPrescription}
                    editingId={editingId}
                    isLocked={isLocked}
                    isLoadingMedicines={isLoadingMedicines}
                    medicineOptions={medicineOptions}
                    timeOptions={TIME_OPTIONS}
                    onCancelEdit={cancelEdit}
                    onSubmit={submitPrescriptionFromDraft}
                    onUpdateDraft={updateDraft}
                    onUpdateMedicineDraft={updateMedicineDraft}
                  />

                  <DonThuocItemsTable
                    prescriptions={prescriptions}
                    isLocked={isLocked}
                    timeOptions={TIME_OPTIONS}
                    onEdit={startEditRow}
                    onDelete={removeRow}
                  />
                </div>

                {/* Summary */}
                  <DonThuocFooterActions
                    isLocked={isLocked}
                    isSaving={isSaving}
                    onDeletePrescription={handleDeletePrescription}
                    onSavePrescription={savePrescription}
                  />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}
