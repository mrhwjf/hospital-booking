import { Input, InputNumber } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

const PRIMARY = "#0F766E";

function toInputValue(value) {
  return value ?? "";
}

function renderNumericProps(editable, onChange, field, extraProps = {}) {
  if (!editable) {
    return { disabled: true, ...extraProps };
  }

  return {
    ...extraProps,
    onChange: (value) => onChange(field, value ?? null),
  };
}

function normalizeBloodPressureInput(value) {
  const filtered = String(value || "").replace(/[^\d/]/g, "");
  const hasSlash = filtered.includes("/");
  const [systolicRaw, ...diastolicParts] = filtered.split("/");
  const systolic = systolicRaw.slice(0, 3);
  const diastolic = diastolicParts.join("").replace(/\//g, "").slice(0, 3);

  if (!hasSlash) {
    return systolic;
  }

  return `${systolic}/${diastolic}`;
}

export default function VitalSigns({ data, editable = false, onChange = () => { } }) {
  return (
    <div
      className="bg-white rounded-[10px] p-5 mb-3"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px 0 rgba(15,118,110,0.06)" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <LineChartOutlined style={{ color: PRIMARY, fontSize: 18 }} />
        <h2 className="text-base font-semibold" style={{ color: PRIMARY }}>
          Chỉ số sinh hiệu
        </h2>
      </div>

      {/* grid for vitals (2 rows) */}
      <div className="grid grid-cols-4 gap-5">

        <div>
          <label className="block text-xs text-gray-500 mb-1">Huyết áp (mmHg)</label>
          <Input
            disabled={!editable}
            value={toInputValue(data?.huyet_ap)}
            onChange={(event) => {
              if (!editable) {
                return;
              }
              onChange("huyet_ap", normalizeBloodPressureInput(event.target.value));
            }}
            readOnly={!editable}
            placeholder="VD: 120/80"
            style={{ borderRadius: 8, borderColor: "#E2E8F0" }}
          />
          <div className="text-[11px] text-gray-400 mt-1">Định dạng: tâm thu/tâm trương (VD: 120/80)</div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nhiệt độ (°C)</label>
          <InputNumber
            value={data?.nhiet_do ?? null}
            className="w-full"
            style={{ borderRadius: 8, borderColor: "#E2E8F0" }}
            {...renderNumericProps(editable, onChange, "nhiet_do", { min: 30, max: 45, step: 0.1, precision: 1 })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nhịp tim (lần/phút)</label>
          <InputNumber
            value={data?.mach ?? null}
            className="w-full"
            style={{ borderRadius: 8, borderColor: "#E2E8F0" }}
            {...renderNumericProps(editable, onChange, "mach", { min: 0, max: 300, step: 1, precision: 0 })}
          />
        </div>

      </div>

      <div className="grid grid-cols-4 gap-5 mt-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Cân nặng (kg)</label>
          <InputNumber
            value={data?.can_nang ?? null}
            className="w-full"
            style={{ borderRadius: 8, borderColor: "#E2E8F0" }}
            {...renderNumericProps(editable, onChange, "can_nang", { min: 0, max: 500, step: 0.1, precision: 1 })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Chiều cao (cm)</label>
          <InputNumber
            value={data?.chieu_cao ?? null}
            className="w-full"
            style={{ borderRadius: 8, borderColor: "#E2E8F0" }}
            {...renderNumericProps(editable, onChange, "chieu_cao", { min: 0, max: 300, step: 0.1, precision: 1 })}
          />
        </div>
      </div>
    </div>
  );
}