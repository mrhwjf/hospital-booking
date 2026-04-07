import { CalendarOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Tag, Typography } from "antd";
import { formatDate, getTrangThaiLabel } from "../utils/lichSuKhamUtils";

const ACTION_META_BY_TYPE = {
  start: "bg-blue-600 hover:bg-blue-700",
  continue: "bg-amber-500 hover:bg-amber-600",
  view: "bg-teal-600 hover:bg-teal-700",
};

const TAG_COLOR_BY_TYPE = {
  start: "blue",
  continue: "gold",
  view: "cyan",
};

const STATUS_TAG_COLOR = {
  tiep_nhan: "default",
  dang_kham: "processing",
  hoan_thanh: "success",
  da_hoan_tat: "success",
  da_hoan_thanh: "success",
};

const { Paragraph, Text } = Typography;

export default function LatestExamCard({ record, onViewDetail, resolveAction }) {
  if (!record) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Không có phiếu khám phù hợp bộ lọc.
      </div>
    );
  }

  const action = resolveAction?.(record) || {
    type: "view",
    label: "Xem chi tiết",
  };

  return (
    <Card
      title={<span className="font-semibold text-teal-700">Phiếu khám mới nhất</span>}
      extra={<Tag color={TAG_COLOR_BY_TYPE[action.type] || "cyan"}>{action.label}</Tag>}
      className="rounded-2xl border border-teal-200 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
    >
      <Descriptions size="small" column={{ xs: 1, md: 2, lg: 4 }} className="mb-3">
        <Descriptions.Item label="Ngày khám">
          <Text strong>
            <CalendarOutlined className="mr-2 text-slate-400" />
            {formatDate(record.thoi_gian_tiep_nhan || record.created_at)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Bác sĩ phụ trách">
          <Text strong>{record.doctor?.ho_ten || "--"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Chuyên khoa">
          <Text>{record.specialty?.ten_chuyen_khoa || "--"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={STATUS_TAG_COLOR[record.trang_thai] || "default"}>{getTrangThaiLabel(record.trang_thai)}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Paragraph className="!mb-4 text-slate-700">
        <Text type="secondary">Chẩn đoán sơ bộ: </Text>
        {record.chan_doan || "Chưa có dữ liệu."}
      </Paragraph>

      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => onViewDetail?.(record, action)}
          className={`${ACTION_META_BY_TYPE[action.type] || ACTION_META_BY_TYPE.view}`}
        >
          {action.label}
        </Button>
      </div>
    </Card>
  );
}
