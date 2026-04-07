import { Button, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function DonThuocItemsTable({
  prescriptions,
  isLocked,
  timeOptions,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên thuốc / Hoạt chất",
      key: "medicine",
      width: 260,
      render: (_, row) => <span className="font-medium text-gray-900">{row.medicine}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
    },
    {
      title: "Liều dùng",
      dataIndex: "instruction",
      key: "instruction",
      width: 220,
      render: (value) => value || "-",
    },
    {
      title: "Thời điểm",
      dataIndex: "time",
      key: "time",
      width: 170,
      render: (value) => timeOptions.find((option) => option.value === value)?.label || "-",
    },
    {
      title: "Số ngày",
      dataIndex: "days",
      key: "days",
      width: 120,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value) => value || "-",
    },
  ];

  if (!isLocked) {
    columns.push({
      title: "",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button type="text" icon={<EditOutlined />} size="middle" onClick={() => onEdit(row)} />
          <Button type="text" danger icon={<DeleteOutlined />} size="middle" onClick={() => onDelete(row.id)} />
        </div>
      ),
    });
  }

  return (
    <Table
      rowKey="id"
      dataSource={prescriptions}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      scroll={{ x: 980 }}
      columns={columns}
    />
  );
}
