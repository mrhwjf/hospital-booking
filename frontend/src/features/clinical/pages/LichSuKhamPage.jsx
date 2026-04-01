import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Empty, Spin } from "antd";
import { getLichSuPhieuKham } from "../../../Services/clinicalService";
import LichSuKhamFilters from "../components/LichSuKhamFilters";
import LatestExamCard from "../components/LatestExamCard";
import ExamHistoryList from "../components/ExamHistoryList";

const IN_PROGRESS_STATUSES = new Set(["dang_kham"]);
const NOT_EXAMINED_STATUSES = new Set(["tiep_nhan", "cho_kham", "dang_ky", "da_dat_lich", "chua_kham"]);
const COMPLETED_STATUSES = new Set(["hoan_thanh", "da_hoan_tat", "da_hoan_thanh"]);

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function toTimeValue(record) {
  const candidates = [record?.created_at, record?.thoi_gian_tiep_nhan, record?.updated_at];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const time = new Date(candidate).getTime();
    if (!Number.isNaN(time)) {
      return time;
    }
  }

  return 0;
}

function pickLatestByPriority(items = []) {
  const sortedByCreatedAt = [...items].sort((a, b) => toTimeValue(b) - toTimeValue(a));

  const inProgress = sortedByCreatedAt.find((record) => IN_PROGRESS_STATUSES.has(normalizeStatus(record?.trang_thai)));
  if (inProgress) {
    return inProgress;
  }

  const notExamined = sortedByCreatedAt.find((record) => NOT_EXAMINED_STATUSES.has(normalizeStatus(record?.trang_thai)));
  if (notExamined) {
    return notExamined;
  }

  return sortedByCreatedAt.find((record) => COMPLETED_STATUSES.has(normalizeStatus(record?.trang_thai))) || null;
}

export default function LichSuKhamPage({ selectedDoctorId, selectedPatient, onBack, onSelectPhieuKham }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const patientId = useMemo(() => {
    const rawId = selectedPatient?.benhNhanId ?? selectedPatient?.id;
    const normalized = Number(rawId);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
  }, [selectedPatient?.benhNhanId, selectedPatient?.id]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!patientId) {
        setRecords([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getLichSuPhieuKham(patientId, {
          per_page: 200,
        });

        if (mounted) {
          const onlyCurrentPatient = (result ?? []).filter((record) => {
            if (record?.benh_nhan?.id) {
              return String(record?.benh_nhan?.id) === String(patientId);
            }

            return true;
          });

          const sorted = [...onlyCurrentPatient].sort((a, b) => {
            return new Date(b.thoi_gian_tiep_nhan).getTime() - new Date(a.thoi_gian_tiep_nhan).getTime();
          });
          setRecords(sorted);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.response?.data?.message || "Không thể tải lịch sử khám của bệnh nhân.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const enrichedRecords = useMemo(() => {
    return records.map((record) => ({
      ...record,
      doctor: {
        id: record?.bac_si?.id ?? record?.bac_si_id,
        ho_ten: record?.bac_si?.ho_ten || record?.bac_si?.ten || "--",
      },
      specialty: record?.bac_si?.chuyen_khoas?.[0] ?? null,
    }));
  }, [records]);

  const doctors = useMemo(() => {
    const seen = new Set();
    return enrichedRecords.reduce((acc, record) => {
      const doctorId = record?.doctor?.id;
      const doctorName = record?.doctor?.ho_ten;

      if (doctorId && doctorName && !seen.has(doctorId)) {
        seen.add(doctorId);
        acc.push({ id: doctorId, ho_ten: doctorName });
      }

      return acc;
    }, []);
  }, [enrichedRecords]);

  const specialties = useMemo(() => {
    const seen = new Set();
    return enrichedRecords.reduce((acc, record) => {
      const specialty = record?.specialty;
      if (specialty?.id && !seen.has(specialty.id)) {
        seen.add(specialty.id);
        acc.push({ id: specialty.id, ten_chuyen_khoa: specialty.ten_chuyen_khoa });
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
        [record.ma_phieu_kham, record.chan_doan, record.trang_thai, record.doctor?.ho_ten]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword);

      const matchTime =
        timeFilter === "all" ||
        (timeFilter === "30d" && dayDiff <= 30) ||
        (timeFilter === "90d" && dayDiff <= 90) ||
        (timeFilter === "365d" && dayDiff <= 365);

      const matchDoctor = doctorFilter === "all" || String(record?.doctor?.id) === String(doctorFilter);
      const matchSpecialty = specialtyFilter === "all" || String(record?.specialty?.id) === String(specialtyFilter);

      return matchKeyword && matchTime && matchDoctor && matchSpecialty;
    });
  }, [doctorFilter, enrichedRecords, keyword, specialtyFilter, timeFilter]);

  const latestRecord = useMemo(() => pickLatestByPriority(filteredRecords), [filteredRecords]);

  const olderRecords = useMemo(() => {
    const latestId = latestRecord?.id;

    return filteredRecords
      .filter((record) => {
        const isCompleted = COMPLETED_STATUSES.has(normalizeStatus(record?.trang_thai));
        const isLatest = latestId !== undefined && latestId !== null && String(record?.id) === String(latestId);
        return isCompleted && !isLatest;
      })
      .sort((a, b) => toTimeValue(b) - toTimeValue(a));
  }, [filteredRecords, latestRecord?.id]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">Lịch sử khám bệnh</h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem và quản lý các phiếu khám bệnh của bệnh nhân: <strong>{selectedPatient?.name || "-"}</strong> ({selectedPatient?.code || "-"})
          </p>
        </div>
        <Button type="primary" onClick={onBack} className="!bg-teal-600 hover:!bg-teal-700 !border-teal-600 !h-10 !px-5 !font-semibold">
          Quay lại danh sách bệnh nhân
        </Button>
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
        <div className="py-20 text-center">
          <Spin tip="Đang tải lịch sử khám..." />
        </div>
      ) : error ? (
        <Alert type="error" showIcon message={error} />
      ) : filteredRecords.length === 0 ? (
        <Empty description="Bệnh nhân này chưa có phiếu khám phù hợp." />
      ) : (
        <>
          <div className="text-lg font-semibold text-slate-800">• Phiếu khám mới nhất</div>
          <LatestExamCard
            record={latestRecord}
            onViewDetail={(record) => {
              if (typeof onSelectPhieuKham === "function") {
                onSelectPhieuKham(record);
              }
            }}
          />

          <div className="pt-2 text-[30px] font-bold text-slate-900">Lịch sử khám cũ hơn</div>
          <ExamHistoryList
            records={olderRecords}
            onViewDetail={(record) => {
              if (typeof onSelectPhieuKham === "function") {
                onSelectPhieuKham(record);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
