import { formatDate, getTrangThaiLabel } from "../utils/lichSuKhamUtils";
import { Button, Card, Table, Tag, Typography } from "antd";

const { Text } = Typography;

const STATUS_TAG_COLOR = {
  tiep_nhan: "default",
  dang_kham: "processing",
  hoan_thanh: "success",
  da_hoan_tat: "success",
  da_hoan_thanh: "success",
};

export default function ExamHistoryList({ records, onViewDetail, resolveAction }) {
  const dataSource = records.map((record) => {
    const action = resolveAction?.(record) || {
      type: "view",
      label: "Xem chi tiết",
    };

    return {
      ...record,
      key: record.id,
      action,
      ngayKham: formatDate(record.thoi_gian_tiep_nhan || record.created_at),
    };
  });

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "ngayKham",
      key: "ngayKham",
      width: 160,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Bác sĩ",
      key: "doctor",
      width: 220,
      render: (_, row) => row.doctor?.ho_ten || "--",
    },
    {
      title: "Chuyên khoa",
      key: "specialty",
      width: 220,
      render: (_, row) => row.specialty?.ten_chuyen_khoa || "--",
    },
    {
      title: "Chẩn đoán",
      key: "chanDoan",
      render: (_, row) => row.chan_doan || "--",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      render: (_, row) => <Tag color={STATUS_TAG_COLOR[row.trang_thai] || "default"}>{getTrangThaiLabel(row.trang_thai)}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 160,
      render: (_, row) => (
        <Button type="link" onClick={() => onViewDetail?.(row, row.action)}>
          {row.action.label}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="hidden md:block">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey="id"
          className="[&_.ant-table-thead>tr>th]:bg-slate-50!"
          scroll={{ x: 980 }}
        />
      </div>

      <div className="md:hidden space-y-3">
        {dataSource.map((row) => (
          <Card key={row.id} className="rounded-xl border border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text strong>{row.ngayKham}</Text>
                <Tag color={STATUS_TAG_COLOR[row.trang_thai] || "default"}>{getTrangThaiLabel(row.trang_thai)}</Tag>
              </div>
              <div className="text-sm text-slate-700">Bác sĩ: {row.doctor?.ho_ten || "--"}</div>
              <div className="text-sm text-slate-700">Chuyên khoa: {row.specialty?.ten_chuyen_khoa || "--"}</div>
              <div className="text-sm text-slate-700">Chẩn đoán: {row.chan_doan || "--"}</div>
              <div className="pt-1">
                <Button type="link" className="px-0!" onClick={() => onViewDetail?.(row, row.action)}>
                  {row.action.label}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
