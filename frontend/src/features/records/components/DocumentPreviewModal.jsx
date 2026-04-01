import { Modal } from "antd";

export default function DocumentPreviewModal({ open, document, previewUrl, loading, onClose }) {
  return (
    <Modal
      title={document ? `Xem tài liệu: ${document.ten_tai_lieu}` : "Xem tài liệu"}
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Đóng"
      cancelButtonProps={{ style: { display: "none" } }}
      width={960}
      centered
      destroyOnHidden
    >

        
      {loading ? (
        <div className="py-8 text-center text-slate-500">Đang lấy URL xem tài liệu...</div>
      ) : !previewUrl ? (
        <div className="py-8 text-center text-slate-500">Tài liệu chưa có URL hợp lệ để xem trước.</div>
      ) : (
        <iframe
          src={previewUrl}
          title={document.ten_tai_lieu || "Tai lieu"}
          className="mt-2 h-[70vh] w-full rounded-lg border border-slate-200"
        />
      )}
    </Modal>
  );
}
