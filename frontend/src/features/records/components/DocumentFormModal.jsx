import { Button, Input, Modal, Select, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

export default function DocumentFormModal({
  open,
  title,
  formState,
  fileList,
  documentTypeOptions,
  phieuKhamOptions,
  onChange,
  onUpload,
  onRemoveUpload,
  onCancel,
  onSubmit,
  submitText,
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
      <p className="mt-1 mb-4 text-sm text-slate-500">Form FE bám đúng các cột lưu trong bảng tai_lieu_ho_so.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Mã tài liệu</label>
          <Input size="large" value={formState.ma_tai_lieu} onChange={(event) => onChange("ma_tai_lieu", event.target.value)} placeholder="TL-2026-005" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Phiếu khám liên kết</label>
          <Select
            size="large"
            className="w-full"
            value={formState.phieu_kham_id}
            onChange={(value) => onChange("phieu_kham_id", value)}
            options={phieuKhamOptions.map((item) => ({
              value: item.id,
              label: `${item.ma_phieu_kham} • ${item.benh_nhan.ma_benh_nhan}`,
            }))}
          />
        </div>

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

        <div>
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">Tên file lưu</label>
          <Input size="large" value={formState.file_name} onChange={(event) => onChange("file_name", event.target.value)} placeholder="ket-qua-xquang.pdf" />
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
        <Button size="large" onClick={onCancel}>Hủy</Button>
        <Button type="primary" size="large" onClick={onSubmit}>{submitText}</Button>
      </div>
    </Modal>
  );
}