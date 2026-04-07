import { Button, Input, InputNumber, Select } from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";

export default function DonThuocDraftForm({
  draftPrescription,
  editingId,
  isLocked,
  isLoadingMedicines,
  medicineOptions,
  timeOptions,
  onCancelEdit,
  onSubmit,
  onUpdateDraft,
  onUpdateMedicineDraft,
}) {
  return (
    <div
      className="rounded-lg p-4 mb-5"
      style={{
        background: editingId !== null ? "#eef7f6" : "#f8fbfb",
        border: editingId !== null ? "1px solid #1c7a71" : "1px solid #e8f3f2",
      }}
    >
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px] md:flex-[2_1_0%]">
          <div className="text-sm text-gray-600 mb-1.5">Tên thuốc</div>
          <Select
            showSearch
            size="large"
            value={draftPrescription.medicineId}
            onChange={onUpdateMedicineDraft}
            options={medicineOptions}
            placeholder="Chọn hoặc tìm tên thuốc..."
            optionFilterProp="label"
            loading={isLoadingMedicines}
            className="w-full"
          />
        </div>

        <div className="w-[120px] min-w-[120px]">
          <div className="text-sm text-gray-600 mb-1.5">Số lượng</div>
          <InputNumber
            size="large"
            value={draftPrescription.quantity}
            onChange={(value) => onUpdateDraft("quantity", value || 1)}
            min={1}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[180px] md:flex-[1_1_0%]">
          <div className="text-sm text-gray-600 mb-1.5">Liều dùng</div>
          <Input
            size="large"
            value={draftPrescription.instruction}
            onChange={(event) => onUpdateDraft("instruction", event.target.value)}
            placeholder="VD: 1 viên x 2 lần/ngày"
          />
        </div>

        <div className="flex-1 min-w-[160px] md:flex-[1_1_0%]">
          <div className="text-sm text-gray-600 mb-1.5">Thời điểm</div>
          <Select
            size="large"
            value={draftPrescription.time}
            onChange={(value) => onUpdateDraft("time", value)}
            options={timeOptions}
            className="w-full"
          />
        </div>

        <div className="w-[110px] min-w-[110px]">
          <div className="text-sm text-gray-600 mb-1.5">Số ngày</div>
          <InputNumber
            size="large"
            value={draftPrescription.days}
            onChange={(value) => onUpdateDraft("days", value || 1)}
            min={1}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[180px] md:flex-[1_1_0%]">
          <div className="text-sm text-gray-600 mb-1.5">Ghi chú</div>
          <Input
            size="large"
            value={draftPrescription.note}
            onChange={(event) => onUpdateDraft("note", event.target.value)}
            placeholder="Ghi chú thêm..."
          />
        </div>

        <div className="ml-auto flex items-end">
          <div className="flex items-center gap-2">
            {editingId !== null && (
              <Button size="large" onClick={onCancelEdit}>
                Hủy
              </Button>
            )}
            <Button
              size="large"
              type="primary"
              shape={editingId !== null ? "default" : "circle"}
              icon={editingId !== null ? <SaveOutlined /> : <PlusOutlined />}
              onClick={onSubmit}
              disabled={isLocked}
            >
              {editingId !== null ? "Lưu" : null}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
