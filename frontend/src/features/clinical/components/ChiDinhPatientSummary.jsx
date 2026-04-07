import { Avatar, Card, Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

function normalizeGender(value) {
  const raw = String(value || "").toLowerCase();

  if (["nam", "male", "m"].includes(raw)) {
    return "Nam";
  }

  if (["nu", "nữ", "female", "f"].includes(raw)) {
    return "Nữ";
  }

  return "Khác";
}

export default function ChiDinhPatientSummary({ selectedPatient, selectedPhieuKham, phieuKhamId }) {
  const rawPatient = selectedPhieuKham?.benh_nhan || {};
  const name = selectedPatient?.name || rawPatient?.ho_ten || rawPatient?.ten || "Bệnh nhân";
  const code = selectedPatient?.code || rawPatient?.ma_benh_nhan || rawPatient?.ma || "--";
  const age = selectedPatient?.age ?? rawPatient?.tuoi ?? "--";
  const gender = selectedPatient?.gender || normalizeGender(rawPatient?.gioi_tinh);
  const address = rawPatient?.dia_chi || "Chưa cập nhật";
  const diagnosis = selectedPhieuKham?.chan_doan || "Chưa có chẩn đoán sơ bộ";

  return (
    <Card className="rounded-[10px] border border-slate-200" bodyStyle={{ padding: 20 }}>
      <div className="flex items-start gap-4">
        <Avatar size={48} icon={<UserOutlined />} style={{ background: "#E0F2FE", color: "#0369A1" }} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-2xl font-semibold text-slate-900 leading-none m-0">{name}</h2>
            <Tag color="cyan" className="font-semibold m-0">
              Mã BN: {code}
            </Tag>
          </div>

          <Descriptions size="small" column={2} className="[&_.ant-descriptions-item-label]:text-slate-500">
            <Descriptions.Item label="Tuổi/Giới tính">{age} / {gender}</Descriptions.Item>
            <Descriptions.Item label="Phiếu khám">{phieuKhamId ? `PK#${phieuKhamId}` : "Chưa chọn"}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>{address}</Descriptions.Item>
          </Descriptions>

          <div className="mt-3 rounded-lg px-3 py-2 text-sm font-medium border border-amber-200 bg-amber-50 text-amber-700">
            Chẩn đoán sơ bộ: {diagnosis}
          </div>
        </div>
      </div>
    </Card>
  );
}
