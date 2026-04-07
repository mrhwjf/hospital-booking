import { Alert, Switch } from "antd";
import ChiDinhSelectionPanel from "../components/ChiDinhSelectionPanel";
import ChiDinhSavedSummary from "../components/ChiDinhSavedSummary";
import useChiDinhEditor from "../hooks/useChiDinhEditor";

export default function PhieuChiDinhPage({
  phieuKhamId,
  isLocked = false,
  refreshKey = 0,
}) {
  const {
    services,
    loadingServices,
    loadingExisting,
    selectedServices,
    isSaving,
    saveError,
    successMessage,
    preloadMessage,
    canLoadBookedItems,
    bookingPreloadEnabled,
    setSelectedServices,
    toggleBookingPreload,
    handleSaveChiDinh,
  } = useChiDinhEditor({
    phieuKhamId,
    refreshKey,
  });

  return (
    <div className="p-6" style={{ background: "#F8FAFC" }}>
      {saveError && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert type="error" showIcon message={saveError} />
        </div>
      )}

      {successMessage && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert type="success" showIcon message={successMessage} />
        </div>
      )}

      {preloadMessage ? (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert type="info" showIcon message={preloadMessage} />
        </div>
      ) : null}

      {canLoadBookedItems && !isLocked ? (
        <div className="max-w-6xl mx-auto mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Nạp nhanh dịch vụ/gói khám bệnh nhân đã chọn khi đặt lịch từ trước đó!
          </div>
          <Switch
            checked={bookingPreloadEnabled}
            checkedChildren="Đang nạp"
            unCheckedChildren="Tắt"
            onChange={toggleBookingPreload}
          />
        </div>
      ) : null}

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-7 flex flex-col gap-6">
          <ChiDinhSelectionPanel
            loading={loadingServices || loadingExisting}
            services={services}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            isLocked={isLocked}
          />
        </div>

        <div className="col-span-5">
          <ChiDinhSavedSummary
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            onSave={handleSaveChiDinh}
            isSaving={isSaving}
            isLocked={isLocked}
          />
        </div>
      </div>
    </div>
  );
}