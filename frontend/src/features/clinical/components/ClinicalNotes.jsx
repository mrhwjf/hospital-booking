import { Input } from "antd";
import {
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  FileSearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const PRIMARY = "#0F766E";

function SectionCard({ icon, title, children }) {
  return (
    <div className="px-5 py-5 border-b border-[#E2E8F0] last:border-b-0">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ClinicalNotes({ data, editable = false, onChange = () => {}, sourceData }) {
  const icdDisplay = data?.ma_icd10_chinh || "";

  function getInputProps(field) {
    if (!editable) {
      return { readOnly: true };
    }

    return {
      onChange: (event) => onChange(field, event.target.value),
    };
  }

  return (
    <div>

      {/* Lý do khám bệnh */}
      <SectionCard
        icon={
          <ExclamationCircleOutlined
            style={{ color: "#F59E0B", fontSize: 18 }}
          />
        }
        title="Lý do khám bệnh"
      >
        <TextArea
          rows={3}
          value={sourceData?.lich_hen?.ly_do_kham || ""}
          readOnly
          placeholder="Chưa có dữ liệu"
          style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
        />
      </SectionCard>

      {/* Triệu chứng lâm sàng */}
      <SectionCard
        icon={
          <MedicineBoxOutlined style={{ color: PRIMARY, fontSize: 18 }} />
        }
        title="Triệu chứng lâm sàng"
      >
        <TextArea
          rows={3}
          value={data?.trieu_chung || ""}
          {...getInputProps("trieu_chung")}
          placeholder="Chưa có dữ liệu"
          style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
        />
      </SectionCard>

      {/* Kết quả khám */}
      <SectionCard
        icon={<FileSearchOutlined style={{ color: PRIMARY, fontSize: 18 }} />}
        title="Kết quả khám"
      >
        <TextArea
          rows={3}
          value={data?.ket_qua_kham || ""}
          {...getInputProps("ket_qua_kham")}
          placeholder="Chưa có dữ liệu"
          style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
        />
      </SectionCard>

      {/* Chẩn đoán ICD-10 */}
      <SectionCard
        icon={
          <FileSearchOutlined style={{ color: PRIMARY, fontSize: 18 }} />
        }
        title="Chẩn đoán ICD-10"
      >
        <Input
          value={icdDisplay}
          {...getInputProps("ma_icd10_chinh")}
          placeholder="Chưa có dữ liệu"
          style={{ borderRadius: 8, borderColor: "#E2E8F0", marginBottom: 10 }}
        />
        <div className="mt-2 text-xs text-gray-500 mb-2">Mã ICD-10 chính (nếu có)</div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Chẩn đoán</label>
            <TextArea
              rows={2}
              value={data?.chan_doan || ""}
              {...getInputProps("chan_doan")}
              placeholder="Nhập chẩn đoán..."
              style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Tình trạng</label>
            <Input value={data?.tinh_trang || ""} {...getInputProps("tinh_trang")} placeholder="Chưa có dữ liệu" style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
          </div>
        </div>
      </SectionCard>

      {/* Lời dặn & Hướng xử trí */}
      <SectionCard
        icon={
          <SolutionOutlined style={{ color: PRIMARY, fontSize: 18 }} />
        }
        title="Lời dặn & Hướng xử trí"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hướng điều trị</label>
            <TextArea
              rows={3}
              value={data?.huong_dieu_tri || ""}
              {...getInputProps("huong_dieu_tri")}
              placeholder="Nhập hướng điều trị..."
              style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Lời dặn</label>
            <TextArea
              rows={3}
              value={data?.loi_dan || ""}
              {...getInputProps("loi_dan")}
              placeholder="Nhập lời dặn..."
              style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }}
            />
          </div>
        </div>
      </SectionCard>

      {/* Hẹn tái khám & Ghi chú nội bộ */}
      <SectionCard
        icon={<SolutionOutlined style={{ color: PRIMARY, fontSize: 18 }} />}
        title="Theo dõi / Ghi chú nội bộ"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hẹn tái khám</label>
            <Input type="date" value={formatDate(data?.hen_tai_kham)} {...getInputProps("hen_tai_kham")} style={{ borderRadius: 8, borderColor: "#E2E8F0" }} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ghi chú nội bộ</label>
            <TextArea rows={2} value={data?.ghi_chu_noi_bo || ""} {...getInputProps("ghi_chu_noi_bo")} placeholder="Chưa có dữ liệu" style={{ borderRadius: 8, borderColor: "#E2E8F0", resize: "none" }} />
          </div>
        </div>
      </SectionCard>

    </div>
  );
}