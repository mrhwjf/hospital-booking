import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Table,
  Tag,
  Spin,
  message,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { getPhieuKhamList } from "../../../Services/clinicalService";

const PRIMARY = "#0F766E"; // Teal từ ui-guidelines

// Thứ tự ưu tiên hiển thị theo trạng thái
const STATUS_ORDER = {
  cho_ke_don: 0,
  dang_kham: 1,
  tiep_nhan: 2,
  hoan_thanh: 3,
};

const STATUS_CONFIG = {
  tiep_nhan: {
    label: "Tiếp nhận",
    color: "#2563EB",
    bg: "#eff6ff",
    dot: "processing",
  }, // Secondary
  dang_kham: {
    label: "Đang khám",
    color: "#F59E0B",
    bg: "#fffbeb",
    dot: "warning",
  }, // Warning
  cho_ke_don: {
    label: "Chờ kê đơn",
    color: "#0F766E",
    bg: "#f0faf9",
    dot: "default",
  }, // Primary
  hoan_thanh: {
    label: "Hoàn thành",
    color: "#16A34A",
    bg: "#ecfdf5",
    dot: "success",
  }, // Success
};

export default function DsPhieuKham() {
  const [phieuKhams, setPhieuKhams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const tableScroll = useMemo(() => {
    if (isMobile) {
      return { x: 920 };
    }
    if (isTablet) {
      return { x: 860 };
    }
    return undefined;
  }, [isMobile, isTablet]);

  // Gọi API lấy dữ liệu phiếu khám
  useEffect(() => {
    const fetchPhieuKhams = async () => {
      try {
        setLoading(true);
        const params = {
          bac_si_id: 2, // Gọi API cho bác sĩ có id = 1
        };

        if (filterStatus) {
          params.trang_thai = filterStatus;
        }

        if (filterDate) {
          params.date = filterDate.format("YYYY-MM-DD");
        }

        if (search) {
          params.search = search;
        }

        const response = await getPhieuKhamList(params);
        setPhieuKhams(response || []);
      } catch (error) {
        console.error("Error fetching phiếu khám:", error);
        message.error("Lỗi khi tải dữ liệu phiếu khám");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPhieuKhams();
    }, 500);

    return () => clearTimeout(timer);
  }, [filterStatus, filterDate, search]);

  const myPatients = phieuKhams;

  const filtered = myPatients
    .filter((pk) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        pk.benh_nhan?.ten?.toLowerCase().includes(q) ||
        pk.ma_phieu_kham?.toLowerCase().includes(q) ||
        pk.benh_nhan?.ma?.toLowerCase().includes(q);
      const matchStatus = !filterStatus || pk.trang_thai === filterStatus;

      const matchDate =
        !filterDate ||
        pk.thoi_gian_tiep_nhan?.startsWith(filterDate.format("YYYY-MM-DD"));

      return matchSearch && matchStatus && matchDate;
    })
    .sort((a, b) => STATUS_ORDER[a.trang_thai] - STATUS_ORDER[b.trang_thai]);

  const countByStatus = (status) =>
    myPatients.filter((pk) => pk.trang_thai === status).length;

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 50,
      render: (_, __, index) => (
        <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
      ),
    },
    {
      title: "Phiếu khám",
      dataIndex: "ma_phieu_kham",
      key: "ma_phieu_kham",
      width: 95,
      render: (text) => (
        <span className="font-mono font-semibold text-xs">{text}</span>
      ),
    },
    {
      title: "Bệnh nhân",
      key: "benh_nhan",
      width: 210,
      render: (_, record) => {
        const cfg = STATUS_CONFIG[record.trang_thai];
        return (
          <div className="flex items-center gap-2">
            <Badge dot status={cfg.dot} offset={[-4, 20]}>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  background: cfg.bg,
                  color: cfg.color,
                  flexShrink: 0,
                  border: `2px solid ${cfg.color}`,
                }}
              />
            </Badge>
            <div className="min-w-0 flex-1">
              <div
                className="font-semibold text-sm"
                style={{ color: "#0F172A" }}
              >
                {record.benh_nhan?.ten || "N/A"}
              </div>
              {/* <div className="text-xs text-gray-400 font-mono">
                {record.benh_nhan?.ma || "N/A"}
              </div> */}
            </div>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      key: "sdt",
      width: 130,
      render: (_, record) => (
        <div className="text-xs text-gray-600 font-mono">
          {record.benh_nhan?.sdt || "N/A"}
        </div>
      ),
    },
    {
      title: "Tuổi / Giới tính",
      key: "info",
      width: 110,
      render: (_, record) => {
        const gioiTinhRaw = record.benh_nhan?.gioi_tinh;

        const gioiTinh =
          gioiTinhRaw === "nu" ? "Nữ" : gioiTinhRaw === "nam" ? "Nam" : "N/A";

        return (
          <div className="text-xs text-gray-600">
            <div>{record.benh_nhan?.tuoi || "N/A"} tuổi</div>
            <div>{gioiTinh}</div>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      key: "time",
      width: 130,
      render: (_, record) => (
        <div className="text-xs text-gray-500">
          {record.thoi_gian_tiep_nhan}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      width: 100,
      render: (_, record) => {
        const cfg = STATUS_CONFIG[record.trang_thai];
        return (
          <Tag
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 11,
            }}
          >
            {cfg.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: PRIMARY,
            borderRadius: 10,
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
          },
        }}
      >
        <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
          <main className="flex-1 overflow-auto px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl pt-6">
              {/* Header với bộ lọc và tìm kiếm */}
              <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="-mx-2 flex w-full gap-2 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap">
                  <button
                    onClick={() => setFilterStatus(null)}
                    className="whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-all"
                    style={{
                      background: !filterStatus ? PRIMARY : "#fff",
                      color: !filterStatus ? "#F8FAFC" : "#374151",
                      borderColor: !filterStatus ? PRIMARY : "#E2E8F0",
                    }}
                  >
                    Tất cả ({myPatients.length})
                  </button>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setFilterStatus(filterStatus === key ? null : key)
                      }
                      className="whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-all"
                      style={{
                        background: filterStatus === key ? cfg.color : cfg.bg,
                        color: filterStatus === key ? "#F8FAFC" : cfg.color,
                        borderColor:
                          filterStatus === key ? cfg.color : "transparent",
                      }}
                    >
                      {cfg.label} ({countByStatus(key)})
                    </button>
                  ))}
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                  <DatePicker
                    placeholder="Lọc theo ngày"
                    className="w-full rounded-full sm:w-48"
                    style={{ borderRadius: 999 }}
                    value={filterDate}
                    onChange={setFilterDate}
                    format="DD-MM-YYYY"
                  />
                  <Input
                    prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                    placeholder="Tìm theo tên, mã bệnh nhân, mã phiếu..."
                    className="w-full rounded-full sm:w-72"
                    style={{ borderRadius: 999 }}
                    variant="filled"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                  />
                </div>
              </div>

              {/* Table */}
              <Spin spinning={loading}>
                <Table
                  columns={columns}
                  dataSource={filtered}
                  rowKey="id"
                  scroll={tableScroll}
                  size={isMobile ? "small" : "middle"}
                  onRow={(record) => ({
                    onClick: () => setSelectedPatient(record),
                    style: { cursor: "pointer" },
                    onMouseEnter: (e) =>
                      (e.currentTarget.style.background = "#f0faf9"),
                    onMouseLeave: (e) =>
                      (e.currentTarget.style.background = "#fff"),
                  })}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} trong ${total}`,
                  }}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                  }}
                  locale={{ emptyText: "Không có phiếu khám nào phù hợp" }}
                />
              </Spin>
            </div>
          </main>
        </div>
      </ConfigProvider>
    </>
  );
}
