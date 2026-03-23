import { Descriptions, Modal, Tag } from "antd";
import { formatDate, getDocumentTypeMeta } from "../utils/recordsUtils";

export default function DocumentDetailModal({ open, document, onClose }) {
  const typeMeta = getDocumentTypeMeta(document?.loai_tai_lieu);

  return (
    <Modal
      title="Chi tiết tài liệu"
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Đóng"
      cancelButtonProps={{ style: { display: "none" } }}
      width={760}
      centered
      destroyOnHidden
    >
      {!document ? null : (
        <Descriptions column={1} bordered size="small" className="mt-2">
          <Descriptions.Item label="Mã tài liệu">{document.ma_tai_lieu}</Descriptions.Item>
          <Descriptions.Item label="Loại tài liệu">
            <Tag style={{ border: "none", color: typeMeta.color, background: `${typeMeta.color}15` }}>{typeMeta.label}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tên tài liệu">{document.ten_tai_lieu}</Descriptions.Item>
          <Descriptions.Item label="Phiếu khám">{document.phieu_kham?.ma_phieu_kham || `#${document.phieu_kham_id}`}</Descriptions.Item>
          <Descriptions.Item label="Bệnh nhân">{document.benh_nhan?.ho_ten || "-"}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{formatDate(document.ngay_tao)}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{document.ghi_chu || "-"}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}