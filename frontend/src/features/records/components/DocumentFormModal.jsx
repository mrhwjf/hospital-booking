import { Button, Input, Modal, Select, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

export default function DocumentFormModal({
  open,
  title,
  formState,
  fileList,
  documentTypeOptions,
  onChange,
  onUpload,
  onRemoveUpload,
  onCancel,
  onSubmit,
  submitText,
  submitting,
}) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={760}
      centered
      destroyOnHidden
    >
      <p className="mb-4 mt-1 text-sm text-slate-500">Nhập metadata tài liệu và tải tệp thật lên Cloudinary.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Loại tài liệu</label>
          <Select
            size="large"
            className="w-full"
            value={formState.loai_tai_lieu}
            onChange={(value) => onChange("loai_tai_lieu", value)}
            options={documentTypeOptions}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Tên tài liệu</label>
          <Input size="large" value={formState.ten_tai_lieu} onChange={(event) => onChange("ten_tai_lieu", event.target.value)} placeholder="Ví dụ: Kết quả X-quang phổi thẳng" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Ngày tạo</label>
          <Input size="large" type="date" value={formState.ngay_tao} onChange={(event) => onChange("ngay_tao", event.target.value)} />
        </div>

      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#0F172A]">Tệp đính kèm</label>
        <Upload
          beforeUpload={onUpload}
          fileList={fileList}
          onRemove={onRemoveUpload}
          maxCount={1}
        >
          <Button size="large" icon={<CloudUploadOutlined />}>Chọn tệp</Button>
        </Upload>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-[#0F172A]">Ghi chú</label>
        <Input.TextArea rows={4} value={formState.ghi_chu} onChange={(event) => onChange("ghi_chu", event.target.value)} placeholder="Thông tin lưu trữ nội bộ, ghi chú khi bàn giao, mức ưu tiên đọc kết quả..." />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button size="large" onClick={onCancel} disabled={submitting}>Hủy</Button>
        <Button type="primary" size="large" onClick={onSubmit} loading={submitting}>{submitText}</Button>
      </div>
    </Modal>
  );
}