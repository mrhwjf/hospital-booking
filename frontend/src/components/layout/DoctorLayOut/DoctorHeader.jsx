import { UserOutlined } from "@ant-design/icons";

export default function DoctorHeader({ doctorName = "Bác sĩ" }) {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white px-6">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Hospital Booking</div>
          <div className="text-lg font-semibold text-slate-900">Khu vực bác sĩ</div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
          <UserOutlined />
          <span>{doctorName}</span>
        </div>
      </div>
    </header>
  );
}
