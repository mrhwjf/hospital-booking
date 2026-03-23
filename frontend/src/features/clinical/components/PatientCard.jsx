import { Avatar, Tag } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
} from "@ant-design/icons";

function formatDate(value) {
  if (!value) {
    return "Chưa có dữ liệu";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getAgeText(dateOfBirth) {
  if (!dateOfBirth) {
    return "Chưa rõ tuổi";
  }

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return "Chưa rõ tuổi";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return `${age} tuổi`;
}

export default function PatientCard({ patient, appointment }) {
  const patientName = patient?.ho_ten || "Chưa có tên bệnh nhân";
  const patientCode = patient?.ma_benh_nhan || `BN${patient?.id || "-"}`;
  const gender = patient?.gioi_tinh || "Chưa rõ";
  const history = patient?.tien_su_benh || "Chưa có dữ liệu";
  const allergy = patient?.tien_su_di_ung || "Không ghi nhận";
  const note = appointment?.ghi_chu_noi_bo || appointment?.ly_do_kham || "Chưa có ghi chú.";

  return (
    <div className="flex flex-col gap-0">

      {/* Avatar & identity */}
      <div className="flex flex-col items-center pb-5 border-b border-[#E2E8F0]">
        <Avatar
          size={80}
          style={{ backgroundColor: "#C2855A", fontSize: 28, fontWeight: 700 }}
        >
          {patientName.charAt(0).toUpperCase()}
        </Avatar>

        <h2 className="text-base font-semibold mt-3 text-[#0F172A]">
          {patientName}
        </h2>

        <p className="text-sm text-gray-400 mt-0.5">
          {getAgeText(patient?.ngay_sinh)}&nbsp;•&nbsp;{gender}&nbsp;•&nbsp;{patientCode}
        </p>
      </div>

      {/* Medical History */}
      <div className="mt-5">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
          Tiền sử bệnh
        </p>
        <p className="text-sm text-[#0F172A] leading-relaxed">
          {history}
        </p>
      </div>

      {/* Allergy */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#DC2626" }}>
          Dị ứng
        </p>
        <Tag
          style={{
            background: "#FEE2E2",
            color: "#DC2626",
            border: "none",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.05em",
            borderRadius: 4,
          }}
        >
          {allergy}
        </Tag>
      </div>

      {/* Appointment */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
          Lịch hẹn
        </p>
        <div className="flex items-center gap-1.5">
          <CalendarOutlined style={{ color: "#16A34A", fontSize: 13 }} />
          <span className="text-sm" style={{ color: "#16A34A" }}>
            {formatDate(appointment?.ngay_hen)}
          </span>
        </div>
      </div>

      {/* Intake note */}
      <div
        className="mt-5 rounded-lg p-3"
        style={{ background: "#F0FDFA", border: "1px solid #CCFBF1" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <MessageOutlined style={{ color: "#0F766E", fontSize: 13 }} />
          <span className="text-xs font-semibold" style={{ color: "#0F766E" }}>
            Ghi chú tiếp nhận
          </span>
        </div>
        <p className="text-sm italic text-gray-600 leading-relaxed">
          "{note}"
        </p>
      </div>

    </div>
  );
}