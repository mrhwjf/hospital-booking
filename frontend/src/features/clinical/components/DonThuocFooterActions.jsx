import { Button, Popconfirm } from "antd";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";

export default function DonThuocFooterActions({
  isLocked,
  isSaving,
  onDeletePrescription,
  onSavePrescription,
}) {
  if (isLocked) {
    return (
      <div
        className="px-5 py-4 rounded-b-xl text-sm text-emerald-700"
        style={{
          background: "#f9fafb",
          borderTop: "1px solid #e8f3f2",
        }}
      >
        Đơn thuốc đã được khóa chỉnh sửa vì phiếu khám đã hoàn tất.
      </div>
    );
  }

  return (
    <div
      className="px-5 py-3 rounded-b-xl"
      style={{
        background: "#f9fafb",
        borderTop: "1px solid #e8f3f2",
      }}
    >
      <div className="mt-4 flex justify-between items-center gap-3">
        <Popconfirm
          title="Xác nhận hủy kê đơn"
          description="Hành động này sẽ xóa toàn bộ đơn thuốc hiện tại. Bạn có chắc chắn muốn tiếp tục?"
          okText="Xóa đơn"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={onDeletePrescription}
        >
          <Button
            size="large"
            danger
            icon={<CloseCircleOutlined />}
            className="font-bold"
          >
            Hủy kê đơn
          </Button>
        </Popconfirm>

        <Button
          size="large"
          type="primary"
          icon={<SaveOutlined />}
          className="font-bold"
          style={{ paddingInline: 28 }}
          loading={isSaving}
          onClick={onSavePrescription}
          disabled={isSaving}
        >
          Lưu &amp; Kết thúc
        </Button>
      </div>
    </div>
  );
}
