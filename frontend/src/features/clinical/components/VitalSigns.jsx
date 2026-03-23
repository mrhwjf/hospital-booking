import { Input } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

const PRIMARY = "#0F766E";

function toInputValue(value) {
  return value ?? "";
}

function renderInputProps(editable, onChange, field) {
  if (!editable) {
    return { readOnly: true };
  }

  return {
    onChange: (event) => onChange(field, event.target.value),
  };
}

export default function VitalSigns({ data, editable = false, onChange = () => {} }) {
  return (
    <div
      className="bg-white rounded-[10px] p-5 mb-3"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px 0 rgba(15,118,110,0.06)" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <LineChartOutlined style={{ color: PRIMARY, fontSize: 18 }} />
        <h2 className="text-base font-semibold" style={{ color: PRIMARY }}>
          Chi số sinh hiệu
        </h2>
      </div>

      {/* grid for vitals (2 rows) */}
      <div className="grid grid-cols-4 gap-5">

        <div>
          <label className="block text-xs text-gray-500 mb-1">Huyết áp (mmHg)</label>
          <Input value={toInputValue(data?.huyet_ap)} {...renderInputProps(editable, onChange, "huyet_ap")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nhiệt độ (°C)</label>
          <Input value={toInputValue(data?.nhiet_do)} {...renderInputProps(editable, onChange, "nhiet_do")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nhịp tim (lần/phút)</label>
          <Input value={toInputValue(data?.mach)} {...renderInputProps(editable, onChange, "mach")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">SPO2 (%)</label>
          <Input value="" readOnly placeholder="Chưa có dữ liệu" style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

      </div>

      <div className="grid grid-cols-4 gap-5 mt-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Cân nặng (kg)</label>
          <Input value={toInputValue(data?.can_nang)} {...renderInputProps(editable, onChange, "can_nang")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Chiều cao (cm)</label>
          <Input value={toInputValue(data?.chieu_cao)} {...renderInputProps(editable, onChange, "chieu_cao")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Mạch (lần/phút)</label>
          <Input value={toInputValue(data?.mach)} {...renderInputProps(editable, onChange, "mach")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Ghi chú ngắn</label>
          <Input value={data?.tinh_trang || ""} {...renderInputProps(editable, onChange, "tinh_trang")} placeholder="Chưa có dữ liệu" style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
        </div>
      </div>
    </div>
  );
}