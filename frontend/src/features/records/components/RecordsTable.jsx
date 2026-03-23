import { Button, Empty, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { formatDate, getDocumentTypeMeta } from "../utils/recordsUtils";

export default function RecordsTable({
  documents,
  selectedDocumentId,
  onSelect,
  onDetail,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: "Mã tài liệu",
      dataIndex: "ma_tai_lieu",
      key: "ma_tai_lieu",
      width: 140,
      render: (_, record) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(record);
          }}
          className="text-left font-semibold text-[#0F172A] hover:text-[#0F766E]"
        >
          {record.ma_tai_lieu}
        </button>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "ten_tai_lieu",
      key: "ten_tai_lieu",
      render: (_, record) => (
        <div>
          <div className="font-medium text-[#0F172A]">{record.ten_tai_lieu}</div>
          <div className="text-xs text-slate-500 mt-1">{record.file_name}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "loai_tai_lieu",
      key: "loai_tai_lieu",
      width: 180,
      render: (value) => {
        const meta = getDocumentTypeMeta(value);

        return (
          <Tag
            style={{
              marginInlineEnd: 0,
              borderRadius: 999,
              border: "none",
              fontWeight: 600,
              color: meta.color,
              background: `${meta.color}15`,
              paddingInline: 10,
            }}
          >
            {meta.label}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      width: 120,
      render: (value) => formatDate(value),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size={6}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onDetail(record);
            }}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(record);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa tài liệu"
            description="Bạn chắc chắn muốn xóa tài liệu này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record)}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(event) => event.stopPropagation()}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">Danh sách tài liệu</h2>
          <p className="mt-1 text-sm text-slate-500">Bảng FE hiển thị theo schema tai_lieu_ho_so, có thể xem, sửa, xóa từng dòng.</p>
        </div>
        <Tag color="cyan">{documents.length} bản ghi</Tag>
      </div>

      {documents.length === 0 ? (
        <Empty description="Không có tài liệu phù hợp với bộ lọc hiện tại." className="py-8" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={documents}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          rowClassName={(record) => (record.id === selectedDocumentId ? "bg-[#F0FDFA]" : "")}
          onRow={(record) => ({
            onClick: () => onSelect(record),
          })}
          scroll={{ x: 940 }}
        />
      )}
    </div>
  );
}