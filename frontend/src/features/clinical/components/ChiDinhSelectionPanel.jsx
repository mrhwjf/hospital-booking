import { Card, Empty, Spin } from "antd";
import ServiceTable from "./ServiceTable";

export default function ChiDinhSelectionPanel({
  loading,
  services,
  selectedServices,
  setSelectedServices,
  isLocked,
}) {
  if (loading) {
    return (
      <Card className="rounded-[10px] border border-slate-200">
        <div className="flex justify-center py-8">
          <Spin tip="Đang tải dữ liệu chỉ định..." />
        </div>
      </Card>
    );
  }

  if (!services.length) {
    return (
      <Card className="rounded-[10px] border border-slate-200" bodyStyle={{ padding: 20 }}>
        <Empty description="Không tìm thấy danh mục dịch vụ/gói khám trong phạm vi chuyên khoa hiện tại." />
      </Card>
    );
  }

  return (
    <ServiceTable
      services={services}
      selectedServices={selectedServices}
      setSelectedServices={setSelectedServices}
      disabled={isLocked}
    />
  );
}
