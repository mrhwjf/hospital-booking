import { useEffect, useMemo, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import LichSuKhamFilters from "../components/LichSuKhamFilters";
import LatestExamCard from "../components/LatestExamCard";
import ExamHistoryList from "../components/ExamHistoryList";
import { getLichSuPhieuKham } from "../../../Services/patients/lichSuKhamService";

// TODO: thay bằng ID bệnh nhân thực từ auth context / route param
const BENH_NHAN_ID = 2;

export default function LichSuKhamPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    setLoading(true);
    getLichSuPhieuKham(BENH_NHAN_ID, { per_page: 50 })
      .then((data) => setRecords(data))
      .catch((err) => setError(err?.message ?? "Không thể tải lịch sử khám."))
      .finally(() => setLoading(false));
  }, []);

  const enrichedRecords = useMemo(() => {
    return records
      .map((record) => ({
        ...record,
        doctor: record.bac_si ?? null,
        specialty: record.bac_si?.chuyen_khoas?.[0] ?? null,
      }))
      .sort((a, b) => new Date(b.thoi_gian_tiep_nhan) - new Date(a.thoi_gian_tiep_nhan));
  }, [records]);

  const doctors = useMemo(() => {
    const seen = new Set();
    return enrichedRecords.reduce((acc, record) => {
      const d = record.doctor;
      if (d && !seen.has(d.id)) {
        seen.add(d.id);
        acc.push({ id: d.id, ho_ten: d.ho_ten });
      }
      return acc;
    }, []);
  }, [enrichedRecords]);

  const specialties = useMemo(() => {
    const seen = new Set();
    return enrichedRecords.reduce((acc, record) => {
      const s = record.specialty;
      if (s && !seen.has(s.id)) {
        seen.add(s.id);
        acc.push({ id: s.id, ten_chuyen_khoa: s.ten_chuyen_khoa });
      }
      return acc;
    }, []);
  }, [enrichedRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const now = new Date();

    return enrichedRecords.filter((record) => {
      const recordDate = new Date(record.thoi_gian_tiep_nhan);
      const dayDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

      const matchKeyword =
        !normalizedKeyword ||
        [record.chan_doan, record.ma_phieu_kham, record.doctor?.ho_ten, record.specialty?.ten_chuyen_khoa]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword);

      const matchTime =
        timeFilter === "all" ||
        (timeFilter === "30d" && dayDiff <= 30) ||
        (timeFilter === "90d" && dayDiff <= 90) ||
        (timeFilter === "365d" && dayDiff <= 365);

      const matchDoctor = doctorFilter === "all" || String(record.bac_si_id) === String(doctorFilter);
      const matchSpecialty = specialtyFilter === "all" || String(record.specialty?.id) === String(specialtyFilter);

      return matchKeyword && matchTime && matchDoctor && matchSpecialty;
    });
  }, [doctorFilter, enrichedRecords, keyword, specialtyFilter, timeFilter]);

  const latestRecord = filteredRecords[0] || null;
  const olderRecords = filteredRecords.slice(1, visibleCount + 1);

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-5">
        <div>
          <h1 className="text-[42px] font-extrabold leading-tight text-slate-900">Lịch sử khám bệnh</h1>
          <p className="mt-1 text-[15px] text-slate-500">Xem và quản lý các phiếu khám bệnh đã thực hiện của bạn.</p>
        </div>

        <LichSuKhamFilters
          keyword={keyword}
          onKeywordChange={setKeyword}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          doctorFilter={doctorFilter}
          onDoctorFilterChange={setDoctorFilter}
          specialtyFilter={specialtyFilter}
          onSpecialtyFilterChange={setSpecialtyFilter}
          doctors={doctors}
          specialties={specialties}
        />

        {loading ? (
          <div className="py-16 text-center text-slate-400">Đang tải...</div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="text-lg font-semibold text-slate-800">• Phiếu khám mới nhất</div>
            <LatestExamCard record={latestRecord} />

            <div className="pt-2 text-[30px] font-bold text-slate-900">Lịch sử khám cũ hơn</div>
            <ExamHistoryList records={olderRecords} />

            {filteredRecords.length > visibleCount + 1 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="inline-flex items-center gap-2 rounded-xl border border-teal-600 bg-white px-6 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  Tải thêm kết quả
                  <DownOutlined />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
