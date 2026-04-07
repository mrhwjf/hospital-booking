import { useEffect, useMemo, useState } from "react";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Descriptions, Empty, Input, Modal, Space, Spin, Table, Tag, message } from "antd";
import { getPhieuKhamList, startPhieuKham } from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";
import DoctorClinicalVisitWorkspace from "../components/DoctorClinicalVisitWorkspace";
import LichSuKhamPage from "./LichSuKhamPage";

const VISIT_STATUS_META = {
  tiep_nhan: { label: "Tiếp nhận", color: "default" },
  dang_kham: { label: "Đang khám", color: "processing" },
  hoan_thanh: { label: "Hoàn thành", color: "success" },
};

function formatDateVi(value, { includeTime = false } = {}) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime
      ? {
        hour: "2-digit",
        minute: "2-digit",
      }
      : {}),
  }).format(date);
}

function toTimestamp(value) {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

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

  return "Khác";
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
        phone: patient?.so_dien_thoai || patient?.sdt || "",
        dateOfBirth: patient?.ngay_sinh || patient?.date_of_birth || null,
        medicalHistory: patient?.tien_su_benh || "",
        allergyHistory: patient?.tien_su_di_ung || "",
        latestVisitAt: exam?.thoi_gian_tiep_nhan || exam?.created_at || null,
        latestVisitCode: exam?.ma_phieu_kham || null,
        latestVisitStatus: exam?.trang_thai || null,
        latestVisitReason: exam?.ly_do_kham || exam?.lich_hen?.ly_do_kham || "",
        latestVisitTimestamp: toTimestamp(exam?.thoi_gian_tiep_nhan || exam?.created_at),
        statusCount: { pending: 0, active: 0, other: 0 },
      });
    } else if (!map.get(patientKey).benhNhanId && benhNhanId) {
      map.get(patientKey).benhNhanId = benhNhanId;
    }

    const current = map.get(patientKey);
    const rawStatus = String(exam?.trang_thai || "").toLowerCase();

    current.phone = current.phone || patient?.so_dien_thoai || patient?.sdt || "";
    current.dateOfBirth = current.dateOfBirth || patient?.ngay_sinh || patient?.date_of_birth || null;
    current.medicalHistory = current.medicalHistory || patient?.tien_su_benh || "";
    current.allergyHistory = current.allergyHistory || patient?.tien_su_di_ung || "";

    const examTimestamp = toTimestamp(exam?.thoi_gian_tiep_nhan || exam?.created_at);
    if (examTimestamp >= (current.latestVisitTimestamp || 0)) {
      current.latestVisitTimestamp = examTimestamp;
      current.latestVisitAt = exam?.thoi_gian_tiep_nhan || exam?.created_at || null;
      current.latestVisitCode = exam?.ma_phieu_kham || current.latestVisitCode;
      current.latestVisitStatus = exam?.trang_thai || current.latestVisitStatus;
      current.latestVisitReason = exam?.ly_do_kham || exam?.lich_hen?.ly_do_kham || current.latestVisitReason;
    }

    if (["dang_ky", "da_dat_lich", "cho_kham", "tiep_nhan"].includes(rawStatus)) {
      current.statusCount.pending += 1;
    } else if (["dang_kham", "cho_chi_dinh"].includes(rawStatus)) {
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

export default function QuanLyBenhNhanPage({ onSelectPatient }) {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [allExams, setAllExams] = useState([]);
  const [patientNameKeyword, setPatientNameKeyword] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPhieuKham, setSelectedPhieuKham] = useState(null);
  const [quickViewPatient, setQuickViewPatient] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

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
          <Space size="small">
            <Button
              size="middle"
              icon={<EyeOutlined />}
              onClick={() => setQuickViewPatient(record)}
            >
              Xem nhanh
            </Button>

            <Button
              type="primary"
              size="middle"
              className="bg-teal-600! hover:bg-teal-700! border-teal-600!"
              onClick={() => {
                if (typeof onSelectPatient === "function") {
                  onSelectPatient(record);
                }

                setSelectedPatient(record);
              }}
            >
              Xem lịch sử phiếu khám
            </Button>
          </Space>
        ),
      },
    ],
    [onSelectPatient],
  );

  useEffect(() => {
    let mounted = true;

    async function loadExamDataForDoctor() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await getPhieuKhamList({ per_page: 200 });

        if (!mounted) {
          return;
        }
        setAllExams(response ?? []);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setLoadError(getApiErrorMessage(error, "Không tải được danh sách bệnh nhân của bác sĩ."));
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
  }, []);

  async function handleSelectPhieuKham(record, actionMeta = {}) {
    if (!record?.id) {
      messageApi.error("Không xác định được phiếu khám để mở chi tiết.");
      return;
    }

    const actionType = String(actionMeta?.type || "view").toLowerCase();

    if (actionType !== "start") {
      setSelectedPhieuKham(record);
      return;
    }

    try {
      const updated = await startPhieuKham(record.id);
      setSelectedPhieuKham(updated ?? { ...record, trang_thai: "dang_kham" });
      messageApi.success("Đã bắt đầu khám và mở không gian làm việc lâm sàng.");
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Không thể bắt đầu khám cho phiếu này."));
    }
  }

  if (selectedPatient && selectedPhieuKham) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        {contextHolder}
        <div className="max-w-7xl mx-auto">
          <DoctorClinicalVisitWorkspace
            selectedPatient={selectedPatient}
            selectedPhieuKham={selectedPhieuKham}
            onBack={() => {
              setSelectedPhieuKham(null);
              setHistoryRefreshKey((prev) => prev + 1);
            }}
            onCompleted={(updatedVisit) => {
              setSelectedPhieuKham(null);
              setHistoryRefreshKey((prev) => prev + 1);

              if (!updatedVisit?.id) {
                return;
              }

              setAllExams((prev) =>
                prev.map((exam) => (String(exam.id) === String(updatedVisit.id) ? { ...exam, ...updatedVisit } : exam)),
              );
            }}
          />
        </div>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        {contextHolder}
        <div className="max-w-6xl mx-auto">
          <LichSuKhamPage
            selectedPatient={selectedPatient}
            refreshKey={historyRefreshKey}
            onBack={() => {
              setSelectedPhieuKham(null);
              setSelectedPatient(null);
            }}
            onSelectPhieuKham={handleSelectPhieuKham}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        {contextHolder}
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <Spin size="large" tip="Đang tải danh sách bệnh nhân..." />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
        {contextHolder}
        <div className="max-w-6xl mx-auto">
          <Alert type="error" showIcon message={loadError} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: "#F8FAFC" }}>
      {contextHolder}
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
                  className="w-full sm:w-70"
                />
              </div>
            </div>
          </div>

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
                pageSize: 5,
                showSizeChanger: false,
                hideOnSinglePage: true,
                showTotal: (total, range) => `Đang hiển thị ${range[0]}-${range[1]} trong số ${total} bệnh nhân`,
              }}
              className="[&_.ant-table-thead>tr>th]:bg-slate-50! [&_.ant-table-thead>tr>th]:text-slate-500! [&_.ant-table-thead>tr>th]:font-semibold! [&_.ant-table-thead>tr>th]:text-xs! [&_.ant-table-tbody>tr>td]:py-5!"
            />
          )}
        </div>
      </div>

      <Modal
        open={Boolean(quickViewPatient)}
        title="Thông tin bệnh nhân"
        onCancel={() => setQuickViewPatient(null)}
        width={760}
        footer={[
          <Button key="close" onClick={() => setQuickViewPatient(null)}>
            Đóng
          </Button>,
          <Button
            key="history"
            type="primary"
            className="bg-teal-600! hover:bg-teal-700! border-teal-600!"
            onClick={() => {
              if (!quickViewPatient) {
                return;
              }

              if (typeof onSelectPatient === "function") {
                onSelectPatient(quickViewPatient);
              }

              setSelectedPatient(quickViewPatient);
              setQuickViewPatient(null);
            }}
          >
            Xem lịch sử phiếu khám
          </Button>,
        ]}
      >
        {quickViewPatient ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-lg font-semibold text-slate-900">{quickViewPatient.name}</div>
              <div className="text-sm text-slate-500">Mã bệnh nhân: {quickViewPatient.code}</div>
            </div>

            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Tuổi">{Number.isFinite(quickViewPatient.age) ? `${quickViewPatient.age}` : "-"}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{quickViewPatient.gender || "-"}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{formatDateVi(quickViewPatient.dateOfBirth)}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{quickViewPatient.phone || "-"}</Descriptions.Item>
              <Descriptions.Item label="Lần khám gần nhất">
                {formatDateVi(quickViewPatient.latestVisitAt, { includeTime: true })}
              </Descriptions.Item>
              <Descriptions.Item label="Mã phiếu gần nhất">
                {quickViewPatient.latestVisitCode || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái gần nhất">
                <Tag color={VISIT_STATUS_META[quickViewPatient.latestVisitStatus]?.color || "default"}>
                  {VISIT_STATUS_META[quickViewPatient.latestVisitStatus]?.label || quickViewPatient.latestVisitStatus || "-"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng lượt gần đây">
                {quickViewPatient.statusCount.pending + quickViewPatient.statusCount.active + quickViewPatient.statusCount.other}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do khám gần nhất" span={2}>
                {quickViewPatient.latestVisitReason || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tiền sử bệnh" span={2}>
                {quickViewPatient.medicalHistory || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tiền sử dị ứng" span={2}>
                {quickViewPatient.allergyHistory || "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
