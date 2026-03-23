import { CalendarOutlined } from "@ant-design/icons";
import { formatDate, getTrangThaiLabel } from "../utils/lichSuKhamUtils";

export default function LatestExamCard({ record }) {
  if (!record) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Không có phiếu khám phù hợp bộ lọc.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-right text-xs font-bold uppercase tracking-wider text-white">
        Mới nhất
      </div>

      <div className="grid grid-cols-12 gap-4 border-b border-slate-200 p-5">
        <div className="col-span-12 md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày khám</div>
          <div className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-900">
            <CalendarOutlined className="text-slate-400" />
            {formatDate(record.created_at)}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bác sĩ phụ trách</div>
          <div className="mt-2 text-2xl text-teal-600">👩🏻‍⚕️</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{record.doctor?.ho_ten || "--"}</div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Chuyên khoa</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{record.specialty?.ten_chuyen_khoa || "--"}</div>
        </div>

        <div className="col-span-12 flex items-start justify-end md:col-span-3">
          <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700">
            Xem chi tiết
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-5">
        <div className="col-span-12 md:col-span-8">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Chẩn đoán sơ bộ</div>
          <div className="mt-2 text-base leading-7 text-slate-700">{record.chan_doan || "Chưa có dữ liệu."}</div>
        </div>

        <div className="col-span-12 text-right md:col-span-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</div>
          <div className="mt-2 text-xl font-bold text-teal-600">{getTrangThaiLabel(record.trang_thai)}</div>
        </div>
      </div>
    </div>
  );
}
