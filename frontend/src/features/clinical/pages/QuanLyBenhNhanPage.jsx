import { useEffect, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Empty, Input, Spin, Table } from "antd";
import { getPhieuKhamList } from "../../../Services/clinicalService";

function computeAgeFromDate(dateOfBirth) {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function normalizeGender(rawGender) {
  const value = String(rawGender || "").toLowerCase();

  if (["nam", "male", "m"].includes(value)) {
    return "Nam";
  }

  if (["nữ", "nu", "female", "f"].includes(value)) {
    return "Nữ";
  }

  return "-";
}

function buildPatientListFromExams(exams = []) {
  const map = new Map();

  for (const exam of exams) {
    const patient = exam?.benh_nhan;
    const rawPatientId = Number(patient?.id);
    const benhNhanId = Number.isFinite(rawPatientId) && rawPatientId > 0 ? rawPatientId : null;

    // Some API resources don't include patient numeric `id` (they include `ma`, `ten`, ...).
    // Derive a stable patient key: prefer `id`, fall back to `ma` (patient code), then name.
    const patientKey = benhNhanId ?? patient?.ma ?? patient?.ma_benh_nhan ?? patient?.ten ?? null;

    if (!patientKey) {
      continue;
    }

    if (!map.has(patientKey)) {
      map.set(patientKey, {
        id: patientKey,
        benhNhanId,
        name: patient?.ten || patient?.ho_ten || `Bệnh nhân #${patientKey}`,
        code: patient?.ma || patient?.ma_benh_nhan || `BN#${patientKey}`,
        age: computeAgeFromDate(patient?.ngay_sinh || patient?.date_of_birth),
        gender: normalizeGender(patient?.gioi_tinh),
        statusCount: { pending: 0, active: 0, other: 0 },
      });
    } else if (!map.get(patientKey).benhNhanId && benhNhanId) {
      map.get(patientKey).benhNhanId = benhNhanId;
    }

    const current = map.get(patientKey);
    const rawStatus = String(exam?.trang_thai || "").toLowerCase();

    if (["dang_ky", "da_dat_lich", "cho_kham", "tiep_nhan"].includes(rawStatus)) {
      current.statusCount.pending += 1;
    } else if (["dang_kham", "cho_ke_don", "cho_chi_dinh"].includes(rawStatus)) {
      current.statusCount.active += 1;
    } else {
      current.statusCount.other += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const aScore = a.statusCount.pending + a.statusCount.active;
    const bScore = b.statusCount.pending + b.statusCount.active;
    return bScore - aScore;
  });
}

export default function QuanLyBenhNhanPage({ selectedDoctorId, onSelectPatient }) {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [allExams, setAllExams] = useState([]);
  const [patientNameKeyword, setPatientNameKeyword] = useState("");

  const patients = useMemo(() => buildPatientListFromExams(allExams), [allExams]);

  const filteredPatients = useMemo(() => {
    const keyword = patientNameKeyword.trim().toLowerCase();

    if (!keyword) {
      return patients;
    }

    return patients.filter((item) => {
      const text = String(item.name || "").toLowerCase();
      return text.includes(keyword);
    });
  }, [patients, patientNameKeyword]);

  const columns = useMemo(
    () => [
      {
        title: "TÊN BỆNH NHÂN",
        dataIndex: "name",
        key: "name",
        width: "46%",
        render: (_, record) => {
          const initials = record.name
            ?.split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");

          return (
            <div className="flex items-center gap-3">
              <Avatar
                style={{ backgroundColor: "#E6FFFA", color: "#0D9488", fontWeight: 700 }}
                size={34}
              >
                {initials || "BN"}
              </Avatar>
              <div>
                <div className="font-semibold text-slate-800 leading-5">{record.name}</div>
                <div className="text-xs text-slate-500">ID : {record.code}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: "TUỔI",
        dataIndex: "age",
        key: "age",
        width: "16%",
        render: (value) => <span className="text-slate-700">{Number.isFinite(value) ? `${value}` : "-"}</span>,
      },
      {
        title: "GIỚI TÍNH",
        dataIndex: "gender",
        key: "gender",
        width: "16%",
        render: (value) => <span className="text-slate-700">{value || "-"}</span>,
      },
      {
        title: "THAO TÁC",
        key: "action",
        width: "22%",
        align: "right",
        render: (_, record) => (
          <Button
            type="primary"
            size="middle"
            disabled={!selectedDoctorId}
            className="!bg-teal-600 hover:!bg-teal-700 !border-teal-600"
            onClick={() => {
              if (typeof onSelectPatient === "function") {
                onSelectPatient(record);
              }
            }}
          >
            Xem lịch sử phiếu khám
          </Button>
        ),
      },
    ],
    [onSelectPatient, selectedDoctorId],
  );

  useEffect(() => {
    let mounted = true;

    async function loadExamDataForDoctor() {
      if (!selectedDoctorId) {
        setAllExams([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const response = await getPhieuKhamList({ bac_si_id: selectedDoctorId, per_page: 200 });

        if (!mounted) {
          return;
        }
        setAllExams(response ?? []);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setLoadError(error?.response?.data?.message || "Không tải được danh sách bệnh nhân của bác sĩ.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadExamDataForDoctor();

    return () => {
      mounted = false;
    };
  }, [selectedDoctorId]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <Spin size="large" tip="Đang tải danh sách bệnh nhân..." />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        <div className="max-w-6xl mx-auto">
          <Alert type="error" showIcon message={loadError} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[30px] font-bold leading-tight text-slate-900">Quản lý bệnh nhân</h2>
                <p className="mt-1 text-sm text-slate-500">Tổng quan về các cuộc hẹn gần đây và đã lên lịch</p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Input
                  allowClear
                  value={patientNameKeyword}
                  onChange={(event) => setPatientNameKeyword(event.target.value)}
                  placeholder="Tìm theo tên bệnh nhân"
                  prefix={<SearchOutlined className="text-slate-400" />}
                  className="w-full sm:w-[280px]"
                />
              </div>
            </div>
          </div>

          {!selectedDoctorId && (
            <div className="px-6 pt-4">
              <Alert
                type="info"
                showIcon
                message="Vui lòng chọn bác sĩ ở trang Thông tin bác sĩ trước khi quản lý bệnh nhân."
              />
            </div>
          )}

          {filteredPatients.length === 0 ? (
            <div className="px-6 py-12">
              <Empty description="Chưa có bệnh nhân đã/đang đặt lịch khám với bác sĩ này." />
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredPatients}
              pagination={{
                pageSize: 4,
                showSizeChanger: false,
                showTotal: (total, range) => `Đang hiển thị ${range[0]}-${range[1]} trong số ${total} bệnh nhân`,
              }}
              className="[&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!text-slate-500 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-xs [&_.ant-table-tbody>tr>td]:!py-5"
            />
          )}
        </div>
      </div>
    </div>
  );
}
