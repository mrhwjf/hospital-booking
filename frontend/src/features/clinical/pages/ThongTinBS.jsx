import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Tag,
  Empty,
  Spin,
  Button,
  Badge,
  Divider,
  Row,
  Col,
  Alert,
  Select,
} from "antd";
import {
  PhoneOutlined,
  BookOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/locale/vi_VN";
import ConfigProvider from "antd/lib/config-provider";
import {
  getThongTinBacSiStatic,
  getThongTinBacSiWeekly,
} from "../../../Services/clinicalService";

dayjs.locale("vi");

const isCanceledError = (error) =>
  error?.code === "ERR_CANCELED" || error?.name === "CanceledError";

/**
 * Lịch dạng timetable sử dụng khung giờ 60 phút.
 * Các ca có thể bắt đầu/ kết thúc ở mốc 30 phút nhờ định vị theo phần trăm.
 */
const ScheduleTimetable = ({
  lichLamViec,
  weekOffset = 0,
  holidays = [],
  doctorLeaves = [],
  weekMeta = null,
}) => {
  const holidayLookup = new Map(
    holidays.map((holiday) => {
      const dateKey = dayjs(holiday.ngay).format("YYYY-MM-DD");
      return [dateKey, holiday.ten_ngay_nghi || "Nghỉ lễ"];
    }),
  );
  const doctorLeaveLookup = doctorLeaves.reduce((acc, leave) => {
    const dateKey = dayjs(leave.ngay).format("YYYY-MM-DD");
    const current = acc.get(dateKey) ?? [];
    current.push(leave);
    acc.set(dateKey, current);
    return acc;
  }, new Map());
  const baseDays = [
    { day: 2, label: "Thứ 2" },
    { day: 3, label: "Thứ 3" },
    { day: 4, label: "Thứ 4" },
    { day: 5, label: "Thứ 5" },
    { day: 6, label: "Thứ 6" },
    { day: 7, label: "Thứ 7" },
    { day: 0, label: "Chủ nhật" },
  ];

  const scheduleStartHour = 7;
  const scheduleEndHour = 18;
  const scheduleStartMinutes = scheduleStartHour * 60;
  const scheduleEndMinutes = scheduleEndHour * 60;
  const totalMinutes = scheduleEndMinutes - scheduleStartMinutes;
  const hourBlocks = Array.from(
    { length: scheduleEndHour - scheduleStartHour },
    (_, idx) => scheduleStartHour + idx,
  );

  const parseMinutes = (timeStr) => {
    if (!timeStr) {
      return scheduleStartMinutes;
    }
    const [hour, minute] = timeStr.split(":").map(Number);
    return hour * 60 + minute;
  };

  const getShiftColor = (shift, isHolidayDay) => {
    if (shift.isLeave) {
      return {
        bg: "bg-green-100",
        border: "border-green-400",
        badge: "success",
      };
    }
    if (shift.isHoliday || isHolidayDay) {
      return { bg: "bg-red-100", border: "border-red-400", badge: "error" };
    }

    const startMinutes = parseMinutes(shift.ca_lam_viec.gio_bat_dau);
    if (startMinutes < 12 * 60) {
      return { bg: "bg-blue-100", border: "border-blue-400", badge: "success" };
    }
    return { bg: "bg-pink-100", border: "border-pink-400", badge: "success" };
  };

  const getShiftPositionStyles = (shift) => {
    const rawStart = parseMinutes(shift.ca_lam_viec.gio_bat_dau);
    const rawEnd = parseMinutes(shift.ca_lam_viec.gio_ket_thuc);
    const boundedStart = Math.max(rawStart, scheduleStartMinutes);
    const boundedEnd = Math.min(rawEnd, scheduleEndMinutes);

    if (boundedEnd <= boundedStart) {
      return null;
    }

    const topPercent =
      ((boundedStart - scheduleStartMinutes) / totalMinutes) * 100;
    const heightPercent = ((boundedEnd - boundedStart) / totalMinutes) * 100;

    return {
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
    };
  };

  const scheduleDays = baseDays.map((dayConfig) => {
    // Tính ngày dựa trên week_range từ API thay vì tự tính tuần
    const startDate = weekMeta?.week_range?.start;
    let dateObj;
    if (startDate) {
      // Lấy Thứ 2 từ API, sau đó cộng dồn số ngày để ra ngày mong muốn
      const daysDiff = dayConfig.day === 0 ? 6 : dayConfig.day - 2; // 0 Chủ nhật = +6 từ Thứ 2
      dateObj = dayjs(startDate).add(daysDiff, "day");
    } else {
      // Fallback nếu chưa có meta (ít xảy ra)
      dateObj = dayjs()
        .add(weekOffset, "week")
        .startOf("week")
        .add(dayConfig.day === 0 ? 6 : dayConfig.day - 2, "day");
    }
    const dateKey = dateObj.format("YYYY-MM-DD");
    const shifts = lichLamViec
      .filter(
        (lich) =>
          lich.ngay_lam_viec === dateKey &&
          lich.trang_thai === "hoat_dong" &&
          lich.ca_lam_viec,
      )
      .sort(
        (a, b) =>
          parseMinutes(a.ca_lam_viec.gio_bat_dau) -
          parseMinutes(b.ca_lam_viec.gio_bat_dau),
      );

    const holidayName = holidayLookup.get(dateKey);
    const leaveEntries = doctorLeaveLookup.get(dateKey) ?? [];

    return {
      ...dayConfig,
      date: dateObj.format("DD/MM"),
      dateKey,
      shifts,
      holidayName,
      leaveEntries,
    };
  });

  return (
    <div className="min-w-[720px] text-[11px] sm:min-w-full sm:text-xs">
      <div className="flex">
        <div className="w-20 bg-teal-600 text-white text-sm flex items-center justify-center font-semibold px-2 py-1.5 border-r border-teal-500">
          Giờ
        </div>
        <div className="flex-1 grid grid-cols-7">
          {scheduleDays.map((day) => (
            <div
              key={day.day}
              className="bg-teal-600 text-white text-center  px-2 py-1.5 border-l border-teal-500"
            >
              <div className="font-bold">{day.label}</div>
              <div className="text-xs text-teal-100">{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex border border-slate-200 border-t-0">
        <div className="w-20 bg-slate-50 border-r border-slate-200">
          {hourBlocks.map((hour) => (
            <div
              key={hour}
              className="h-12 border-b border-slate-200 flex items-center justify-center   pr-2"
            >
              <span className="text-sm font-semibold text-slate-600">
                {`${String(hour).padStart(2, "0")}:00`}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7">
          {scheduleDays.map((day) => {
            const leaveBlocks = day.leaveEntries.map((leave) => {
              const startTime = leave.gio_bat_dau || "07:00";
              const endTime = leave.gio_ket_thuc || "18:00";
              return {
                id: `leave-${leave.id}`,
                isLeave: true,
                leaveReason: leave.ly_do,
                ca_lam_viec: {
                  ten_ca: leave.ly_do || "Nghỉ riêng",
                  gio_bat_dau: startTime,
                  gio_ket_thuc: endTime,
                },
                phong_kham: null,
              };
            });

            const columnShifts = day.holidayName
              ? [
                  {
                    id: `holiday-${day.dateKey}`,
                    isHoliday: true,
                    ca_lam_viec: {
                      ten_ca: day.holidayName,
                      gio_bat_dau: "07:00",
                      gio_ket_thuc: "18:00",
                    },
                  },
                ]
              : day.shifts;

            const displayShifts = [...columnShifts, ...leaveBlocks];

            return (
              <div
                key={day.day}
                className={`relative border-r border-slate-200 last:border-r-0 ${
                  day.holidayName ? "bg-red-50" : "bg-white"
                }`}
              >
                {hourBlocks.map((hour) => (
                  <div
                    key={`${day.day}-${hour}`}
                    className="h-12 border-b border-slate-100"
                  />
                ))}
                {displayShifts.map((shift) => {
                  const position = getShiftPositionStyles(shift);
                  if (!position) {
                    return null;
                  }
                  const colors = getShiftColor(shift, Boolean(day.holidayName));

                  return (
                    <div
                      key={shift.id}
                      className={`absolute left-0.5 right-0.5 rounded-md shadow-sm border ${colors.bg} ${colors.border} px-2 py-1 text-[11px] text-slate-900 flex flex-col gap-0.5`}
                      style={position}
                    >
                      <div className="text-xs font-semibold text-slate-900">
                        {shift.ca_lam_viec.ten_ca}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-700">
                        🕐 {shift.ca_lam_viec.gio_bat_dau} -{" "}
                        {shift.ca_lam_viec.gio_ket_thuc}
                      </div>
                      {shift.phong_kham && (
                        <div className="text-[12px] text-slate-700">
                          📍 {shift.phong_kham.ten_phong}
                        </div>
                      )}
                      {shift.isLeave && shift.leaveReason && (
                        <div className="text-[12px] text-slate-700">
                          📌 {shift.leaveReason}
                        </div>
                      )}
                      {/* <Badge
                        status={shift.isHoliday ? "error" : colors.badge}
                          text={shift.isHoliday ? "Nghỉ" : "Hoạt động"}
                          className="text-[10px]"
                      /> */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Trang thông tin bác sĩ
 * Hiển thị: thông tin bác sĩ, chuyên khoa, và lịch làm việc
 */
const ThongTinBS = ({ selectedDoctorId, onDoctorChange }) => {
  const activeDoctorId = Number(selectedDoctorId) || 1;
  const [bacSiInfo, setBacSiInfo] = useState(null);
  const [chuyenKhoa, setChuyenKhoa] = useState([]);
  const [lichLamViec, setLichLamViec] = useState([]);
  const [ngayNghiLe, setNgayNghiLe] = useState([]);
  const [bacSiNghi, setBacSiNghi] = useState([]);
  const [weekMeta, setWeekMeta] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [profileError, setProfileError] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);
  const [loadingStatic, setLoadingStatic] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  // Track controllers and request ids to guard against race conditions when users spam clicks
  const staticAbortRef = useRef(null);
  const scheduleAbortRef = useRef(null);
  const staticRequestIdRef = useRef(0);
  const scheduleRequestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      staticAbortRef.current?.abort();
      scheduleAbortRef.current?.abort();
    };
  }, []);

  const fetchStaticInfo = useCallback(async () => {
    staticAbortRef.current?.abort();
    const controller = new AbortController();
    staticAbortRef.current = controller;
    const requestId = ++staticRequestIdRef.current;

    setProfileError(null);
    setLoadingStatic(true);

    try {
      const response = await getThongTinBacSiStatic(
        { bac_si_id: activeDoctorId },
        { signal: controller.signal },
      );
      if (
        controller.signal.aborted ||
        staticRequestIdRef.current !== requestId
      ) {
        return;
      }
      const payload = response?.data ?? {};
      setBacSiInfo(payload.bac_si ?? null);
      setChuyenKhoa(payload.chuyen_khoa ?? []);
    } catch (error) {
      if (
        controller.signal.aborted ||
        staticRequestIdRef.current !== requestId ||
        isCanceledError(error)
      ) {
        return;
      }
      console.error("Error loading doctor info:", error);
      setProfileError(
        error?.response?.data?.message || "Không thể tải thông tin bác sĩ.",
      );
      setBacSiInfo(null);
      setChuyenKhoa([]);
    } finally {
      if (
        staticRequestIdRef.current === requestId &&
        !controller.signal.aborted
      ) {
        setLoadingStatic(false);
      }
    }
  }, [activeDoctorId]);

  const fetchWeeklySchedule = useCallback(async (weekOffset) => {
    scheduleAbortRef.current?.abort();
    const controller = new AbortController();
    scheduleAbortRef.current = controller;
    const requestId = ++scheduleRequestIdRef.current;

    setScheduleError(null);
    setLoadingSchedule(true);

    try {
      const response = await getThongTinBacSiWeekly(
        {
          bac_si_id: activeDoctorId,
          week_offset: weekOffset,
        },
        { signal: controller.signal },
      );
      if (
        controller.signal.aborted ||
        scheduleRequestIdRef.current !== requestId
      ) {
        return;
      }
      const payload = response?.data ?? {};
      setLichLamViec(payload.lich_lam_viec ?? []);
      setNgayNghiLe(payload.ngay_nghi_le ?? []);
      setWeekMeta(payload.meta ?? null);
      setBacSiNghi(payload.bac_si_nghi ?? []);
    } catch (error) {
      if (
        controller.signal.aborted ||
        scheduleRequestIdRef.current !== requestId ||
        isCanceledError(error)
      ) {
        return;
      }
      console.error("Error loading schedule:", error);
      setScheduleError(
        error?.response?.data?.message || "Không thể tải lịch làm việc.",
      );
      setLichLamViec([]);
      setNgayNghiLe([]);
      setWeekMeta(null);
      setBacSiNghi([]);
    } finally {
      if (
        scheduleRequestIdRef.current === requestId &&
        !controller.signal.aborted
      ) {
        setLoadingSchedule(false);
      }
    }
  }, [activeDoctorId]);

  useEffect(() => {
    fetchStaticInfo();
  }, [fetchStaticInfo]);

  useEffect(() => {
    fetchWeeklySchedule(selectedWeek);
  }, [selectedWeek, fetchWeeklySchedule]);

  useEffect(() => {
    setSelectedWeek(0);
  }, [activeDoctorId]);

  if (loadingStatic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" description="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!bacSiInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty
          description={profileError || "Không tìm thấy thông tin bác sĩ"}
        />
      </div>
    );
  }

  // Mapping hoc_vi display
  const hocViMap = {
    bac_si: "Bác sĩ",
    thac_si: "Thạc sĩ",
    tien_si: "Tiến sĩ",
    pgs: "PGS",
    gs: "GS",
  };

  // Mapping trang_thai display
  const trangThaiMap = {
    hoat_dong: { text: "Hoạt động", color: "success" },
    tam_nghi: { text: "Tạm nghỉ", color: "warning" },
    nghi_viec: { text: "Nghỉ việc", color: "error" },
  };

  const statusDisplay = trangThaiMap[bacSiInfo.trang_thai];

  const buttonBaseClass =
    "flex w-full items-center justify-center gap-1 px-4 h-10 rounded-md font-semibold transition-all duration-150 sm:w-auto";
  const buttonStyles = {
    solid:
      "bg-[#0F766E] border border-[#0F766E] text-white hover:bg-[#0c5c52] hover:border-[#0c5c52]",
    outline:
      "bg-white border border-[#0F766E] text-[#0F766E] hover:bg-[#E6FFFA]",
  };

  const weekRangeText = weekMeta?.week_range
    ? `${dayjs(weekMeta.week_range.start).format("DD/MM")} - ${dayjs(
        weekMeta.week_range.end,
      ).format("DD/MM/YYYY")}`
    : null;

  return (
    <ConfigProvider locale={viVN}>
      <div className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="shadow-lg border-0 rounded-[10px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Bác sĩ đang thao tác</h3>
                <p className="text-sm text-slate-500">Chọn bác sĩ để test luồng khám trước khi tích hợp đăng nhập.</p>
              </div>
              <Select
                value={activeDoctorId}
                onChange={(value) => {
                  if (typeof onDoctorChange === "function") {
                    onDoctorChange(value);
                  }
                }}
                style={{ width: 220 }}
                options={[
                  { value: 1, label: "Bác sĩ #1" },
                  { value: 2, label: "Bác sĩ #2" },
                  { value: 3, label: "Bác sĩ #3" },
                  { value: 4, label: "Bác sĩ #4" },
                  { value: 5, label: "Bác sĩ #5" },
                ]}
              />
            </div>
          </Card>

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2xl font-bold text-slate-900">
              Thông tin bác sĩ
            </h3>
            <Badge
              status={statusDisplay.color}
              text={statusDisplay.text}
              className="text-lg"
            />
          </div>

          {/* Doctor Information Card */}
          <Card
            className="shadow-lg border-0 rounded-[10px]"
            style={{ borderRadius: "10px" }}
          >
            <Row gutter={[32, 32]}>
              {/* Left Column - Basic Info */}
              <Col xs={24} sm={24} md={12}>
                <div className="space-y-6">
                  {/* Doctor Header */}
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 mb-2">
                      <span>{bacSiInfo.ho_ten}</span>
                    </h2>
                    <p className="text-teal-600 font-semibold text-lg">
                      {hocViMap[bacSiInfo.hoc_vi]}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Mã bác sĩ:{" "}
                      <span className="font-mono font-semibold text-slate-700">
                        {bacSiInfo.ma_bac_si}
                      </span>
                    </p>
                  </div>

                  <Divider className="my-0" />

                  {/* Info Grid */}
                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <PhoneOutlined className="text-teal-600 text-xl shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-500">Số điện thoại</p>
                        <p className="text-base font-semibold text-slate-900 break-all">
                          {bacSiInfo.so_dien_thoai}
                        </p>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-4">
                      <ClockCircleOutlined className="text-teal-600 text-xl shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Kinh nghiệm</p>
                        <p className="text-base font-semibold text-slate-900">
                          {bacSiInfo.kinh_nghiem} năm
                        </p>
                      </div>
                    </div>

                    {/* Certification */}
                    <div className="flex items-start gap-4">
                      <CheckCircleOutlined className="text-teal-600 text-xl shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">
                          Chứng chỉ hành nghề
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {bacSiInfo.chung_chi_hanh_nghe}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Right Column - Introduction & Specialties */}
              <Col xs={24} sm={24} md={12}>
                <div className="space-y-6">
                  {/* Introduction */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOutlined className="text-teal-600" />
                      Giới thiệu
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-700 leading-relaxed">
                        {bacSiInfo.gioi_thieu}
                      </p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TeamOutlined className="text-teal-600" />
                      Chuyên khoa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {chuyenKhoa.map((ck) => (
                        <Tag
                          key={ck.id}
                          color={ck.la_chuyen_khoa_chinh ? "teal" : "blue"}
                          className="px-3 py-1.5 text-sm font-medium"
                        >
                          {ck.ten_chuyen_khoa}
                          {ck.la_chuyen_khoa_chinh}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Work Schedule Timetable Section */}
          <div className="mt-3">
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
              {weekRangeText && (
                <h3 className="text-2xl font-bold text-slate-900">
                  Tuần {weekRangeText}
                </h3>
              )}

              <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row sm:justify-end">
                <Button
                  type="default"
                  icon={<span>❮</span>}
                  onClick={() => setSelectedWeek((prev) => prev - 1)}
                  className={`${buttonBaseClass} ${buttonStyles.solid}`}
                >
                  Tuần trước
                </Button>
                <Button
                  type="default"
                  onClick={() => setSelectedWeek(0)}
                  className={`${buttonBaseClass} ${
                    selectedWeek === 0
                      ? buttonStyles.solid
                      : buttonStyles.outline
                  }`}
                >
                  Tuần này
                </Button>
                <Button
                  type="default"
                  disabled={loadingSchedule}
                  onClick={() => setSelectedWeek((prev) => prev + 1)}
                  className={`${buttonBaseClass} ${buttonStyles.solid}`}
                >
                  Tuần sau <span>❯</span>
                </Button>
              </div>
            </div>
            

            {scheduleError && (
              <Alert
                type="error"
                message={scheduleError}
                showIcon
                className="mb-4"
              />
            )}

            <Card className="shadow-lg border-0 rounded-[10px] overflow-hidden">
              {loadingSchedule ? (
                <div className="py-12 flex items-center justify-center">
                  <Spin description="Đang tải lịch làm việc..." />
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <ScheduleTimetable
                    lichLamViec={lichLamViec}
                    weekOffset={selectedWeek}
                    holidays={ngayNghiLe}
                    doctorLeaves={bacSiNghi}
                    weekMeta={weekMeta}
                  />
                  {lichLamViec.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-slate-700 text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg px-6 py-4">
                        Chưa có ca làm việc nào trong tuần này
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ThongTinBS;
