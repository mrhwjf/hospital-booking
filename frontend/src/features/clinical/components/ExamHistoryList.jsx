import { formatDate } from "../utils/lichSuKhamUtils";

export default function ExamHistoryList({ records }) {
  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => {
        const ngayKham = formatDate(record.thoi_gian_tiep_nhan || record.created_at);

        return (
          <div key={record.id} className="grid grid-cols-12 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <div className="col-span-12 md:col-span-2">
              <div className="text-xs text-slate-500">Ngày khám</div>
              <div className="font-semibold text-slate-900">{ngayKham}</div>
            </div>

            <div className="col-span-12 md:col-span-2">
              <div className="text-xs text-slate-500">Bác sĩ</div>
              <div className="font-semibold text-slate-900">{record.doctor?.ho_ten || "--"}</div>
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className="text-xs text-slate-500">Chuyên khoa</div>
              <div className="font-semibold text-slate-900">{record.specialty?.ten_chuyen_khoa || "--"}</div>
            </div>

            <div className="col-span-12 md:col-span-3">
              <div className="text-xs text-slate-500">Chẩn đoán</div>
              <div className="font-medium text-slate-700">{record.chan_doan || "--"}</div>
            </div>

            <div className="col-span-12 text-right md:col-span-2">
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800">
                Chi tiết
                <span>›</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
