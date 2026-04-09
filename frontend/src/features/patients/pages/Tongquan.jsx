import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Grid,
  List,
  Modal,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  HistoryOutlined,
  IdcardOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getPatientDashboard } from "../../../api/dashboardApi";
import { getLichHenById } from "../../../api/schedulingApi";
import { fetchVisitDetail, fetchVisitTaiLieuSignedUrl, getApiErrorMessage } from "../../../Services/patientVisitHistoryService";
import VisitDetailModal from "../components/VisitDetailModal";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import AppointmentDetails from "../../scheduling/components/AppointmentDetails";

const { useBreakpoint } = Grid;
const { Paragraph, Text, Title } = Typography;

const appointmentStatusMeta = {
  dang_cho: { label: "Đang chờ", color: "gold" },
  da_thanh_toan: { label: "Đã thanh toán", color: "blue" },
  da_xac_nhan: { label: "Đã xác nhận", color: "cyan" },
  da_hoan_tat: { label: "Đã hoàn tất", color: "green" },
  da_huy: { label: "Đã hủy", color: "red" },
  khong_den: { label: "Không đến", color: "orange" },
};

const visitStatusMeta = {
  tiep_nhan: { label: "Tiếp nhận", color: "gold" },
  dang_kham: { label: "Đang khám", color: "blue" },
  hoan_thanh: { label: "Hoàn thành", color: "green" },
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return String(dateString);
  }

  return date.toLocaleDateString("vi-VN");
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  return String(timeString).slice(0, 5);
};

const getDoctorName = (doctorValue) => {
  if (!doctorValue) return "N/A";
  if (typeof doctorValue === "string") return doctorValue;
  return doctorValue?.ho_ten || doctorValue?.ten || "N/A";
};

const getSpecialtyName = (specialtyValue) => {
  if (!specialtyValue) return "N/A";
  if (typeof specialtyValue === "string") return specialtyValue;
  return specialtyValue?.ten_chuyen_khoa || specialtyValue?.name || "N/A";
};

const renderStatusTag = (statusValue, dictionary) => {
  const meta = dictionary?.[statusValue];
  return <Tag color={meta?.color || "default"}>{meta?.label || statusValue || "N/A"}</Tag>;
};

const Tongquan = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("phieu-kham");
  const [loadingVisitDetail, setLoadingVisitDetail] = useState(false);
  const [visitDetail, setVisitDetail] = useState(null);
  const [visitChiDinhs, setVisitChiDinhs] = useState([]);
  const [visitDonThuoc, setVisitDonThuoc] = useState(null);
  const [visitTaiLieus, setVisitTaiLieus] = useState([]);
  const [loadingDocumentId, setLoadingDocumentId] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatientDashboard();
      const normalizedData = response?.data ?? response;
      setDashboardData(normalizedData);
    } catch (requestError) {
      const messageText =
        requestError?.response?.data?.error?.message ||
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Không thể tải dữ liệu dashboard.";
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVisitDetailBundle = useCallback(async (visitId) => {
    setLoadingVisitDetail(true);
    try {
      const detailBundle = await fetchVisitDetail(visitId);
      setVisitDetail(detailBundle.visit);
      setVisitChiDinhs(detailBundle.chiDinhs);
      setVisitDonThuoc(detailBundle.donThuoc);
      setVisitTaiLieus(detailBundle.taiLieus);
    } catch (requestError) {
      message.error(getApiErrorMessage(requestError, "Không thể tải chi tiết phiếu khám."));
    } finally {
      setLoadingVisitDetail(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const patientInfo = useMemo(() => dashboardData?.patient_info || {}, [dashboardData]);
  const upcomingAppointments = useMemo(() => dashboardData?.upcoming_appointments || [], [dashboardData]);
  const recentVisitHistory = useMemo(() => dashboardData?.recent_visit_history || [], [dashboardData]);
  const healthProfile = useMemo(() => dashboardData?.health_profile || {}, [dashboardData]);
  const healthReminder = useMemo(() => dashboardData?.health_reminder || {}, [dashboardData]);

  const selectedVisit = useMemo(() => {
    if (visitDetail) {
      return visitDetail;
    }

    return recentVisitHistory.find((visit) => visit.id === selectedVisitId) || null;
  }, [recentVisitHistory, selectedVisitId, visitDetail]);

  const handleOpenAppointmentDetail = async (appointment) => {
    setAppointmentModalOpen(true);
    setAppointmentLoading(true);

    const fallbackDetail = {
      ...appointment,
      khung_gio_kham: appointment.khung_gio_kham ||
        (appointment.gio_hen
          ? {
            gio_bat_dau: appointment.gio_hen,
            gio_ket_thuc: appointment.gio_ket_thuc,
            phong_kham: appointment.phong_kham || null,
          }
          : null),
      dich_vu_lich_hens: appointment.dich_vu_lich_hens || [],
    };

    setAppointmentDetail(fallbackDetail);

    try {
      const response = await getLichHenById(appointment.id);
      setAppointmentDetail(response?.data || fallbackDetail);
    } catch (requestError) {
      message.warning(getApiErrorMessage(requestError, "Không thể tải đầy đủ chi tiết lịch hẹn."));
    } finally {
      setAppointmentLoading(false);
    }
  };

  const handleCloseAppointmentDetail = () => {
    setAppointmentModalOpen(false);
    setAppointmentDetail(null);
  };

  const handleOpenVisitDetail = async (visit) => {
    setSelectedVisitId(visit.id);
    setActiveDetailTab("phieu-kham");
    setDetailOpen(true);
    await loadVisitDetailBundle(visit.id);
  };

  const handleCloseVisitDetail = () => {
    setDetailOpen(false);
    setSelectedVisitId(null);
    setVisitDetail(null);
    setVisitChiDinhs([]);
    setVisitDonThuoc(null);
    setVisitTaiLieus([]);
  };

  const handleOpenDocument = async (document) => {
    if (!selectedVisitId || !document?.id) {
      return;
    }

    setLoadingDocumentId(document.id);
    try {
      const response = await fetchVisitTaiLieuSignedUrl({
        visitId: selectedVisitId,
        taiLieuId: document.id,
      });

      if (!response?.url) {
        message.warning("Không lấy được URL tài liệu.");
        return;
      }

      setPreviewTitle(document.ten_tai_lieu || document.ma_tai_lieu || "Xem tài liệu");
      setPreviewUrl(response.url);
      setPreviewOpen(true);
    } catch (requestError) {
      message.error(getApiErrorMessage(requestError, "Không thể mở tài liệu hồ sơ."));
    } finally {
      setLoadingDocumentId(null);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl("");
    setPreviewTitle("");
  };

  const visitColumns = [
    {
      title: "Ngày khám",
      dataIndex: "ngay_kham",
      key: "ngay_kham",
      render: (value) => formatDate(value),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "chuyen_khoa",
      key: "chuyen_khoa",
      render: (value) => getSpecialtyName(value),
    },
    {
      title: "Bác sĩ",
      dataIndex: "bac_si",
      key: "bac_si",
      render: (value) => getDoctorName(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (value) => renderStatusTag(value, visitStatusMeta),
    },
    {
      title: "Chi tiết",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleOpenVisitDetail(record)}
          aria-label="Xem chi tiết phiếu khám"
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <Alert
            type="error"
            showIcon
            message="Lỗi tải dữ liệu"
            description={error}
            action={
              <Button type="primary" danger onClick={fetchDashboardData}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <Space direction="vertical" size={16} className="w-full">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Title level={3} className="mb-1">
                  Chào mừng quay trở lại, {patientInfo.ho_ten || "Khách hàng"}
                </Title>
                <Paragraph className="mb-0 text-slate-500">
                  Theo dõi lịch hẹn, lịch sử khám và các nhắc nhở sức khỏe của bạn.
                </Paragraph>
              </div>

              <Button icon={<ReloadOutlined />} onClick={fetchDashboardData}>
                Làm mới
              </Button>
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Mã bệnh nhân"
                  value={patientInfo.ma_benh_nhan || "N/A"}
                  prefix={<IdcardOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Nhóm máu"
                  value={patientInfo.nhom_mau || "N/A"}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={15}>
              <Space direction="vertical" size={16} className="w-full">
                <Card
                  title={
                    <Space>
                      <CalendarOutlined />
                      <span>Lịch hẹn sắp tới</span>
                    </Space>
                  }
                  extra={<Badge color="#0F766E" text={`${upcomingAppointments.length} lịch`} />}
                >
                  {upcomingAppointments.length === 0 ? (
                    <Empty description="Bạn không có lịch hẹn nào trong thời gian tới." />
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={upcomingAppointments}
                      pagination={{
                        pageSize: 2,
                        hideOnSinglePage: true,
                      }}
                      renderItem={(appointment) => (
                        <List.Item
                          actions={[
                            <Button
                              key={`upcoming-view-${appointment.id}`}
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => handleOpenAppointmentDetail(appointment)}
                              aria-label="Xem chi tiết lịch hẹn"
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<UserOutlined className="text-teal-700" />}
                            title={
                              <Space size={8} wrap>
                                <Text strong>{getSpecialtyName(appointment.chuyen_khoa)}</Text>
                                {renderStatusTag(appointment.trang_thai, appointmentStatusMeta)}
                              </Space>
                            }
                            description={
                              <Space direction="vertical" size={2}>
                                <Text type="secondary">
                                  {formatDate(appointment.ngay_hen)} {appointment.gio_hen ? `• ${formatTime(appointment.gio_hen)}` : ""}
                                  {appointment.gio_ket_thuc ? ` - ${formatTime(appointment.gio_ket_thuc)}` : ""}
                                </Text>
                                <Text>Bác sĩ: {getDoctorName(appointment.bac_si)}</Text>
                                <Text type="secondary">
                                  Phòng: {appointment.phong_kham?.ten_phong || "Chưa xác định"}
                                </Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Card>

                <Card
                  title={
                    <Space>
                      <HistoryOutlined />
                      <span>Lịch sử khám gần đây</span>
                    </Space>
                  }
                >
                  {recentVisitHistory.length === 0 ? (
                    <Empty description="Không có lịch sử khám gần đây." />
                  ) : !isMobile ? (
                    <Table
                      rowKey="id"
                      columns={visitColumns}
                      dataSource={recentVisitHistory}
                      pagination={false}
                      scroll={{ x: "max-content" }}
                    />
                  ) : (
                    <List
                      dataSource={recentVisitHistory}
                      renderItem={(visit) => (
                        <List.Item
                          actions={[
                            <Button
                              key={`visit-view-${visit.id}`}
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => handleOpenVisitDetail(visit)}
                              aria-label="Xem chi tiết lịch sử khám"
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            title={<Text strong>{formatDate(visit.ngay_kham)}</Text>}
                            description={
                              <Space direction="vertical" size={2}>
                                <Text>Chuyên khoa: {getSpecialtyName(visit.chuyen_khoa)}</Text>
                                <Text>Bác sĩ: {getDoctorName(visit.bac_si)}</Text>
                                {renderStatusTag(visit.trang_thai, visitStatusMeta)}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Card>
              </Space>
            </Col>

            <Col xs={24} xl={9}>
              <Space direction="vertical" size={16} className="w-full">
                <Card
                  title={
                    <Space>
                      <HeartOutlined />
                      <span>Hồ sơ sức khỏe</span>
                    </Space>
                  }
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Tiền sử bệnh">
                      {healthProfile.tien_su_benh || "Không có thông tin"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiền sử dị ứng">
                      {healthProfile.tien_su_di_ung || "Không có thông tin"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card style={{ background: "#0F766E", color: "#FFFFFF" }}>
                  <Space direction="vertical" size={10} className="w-full">
                    <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700 }}>
                      Nhắc nhở sức khỏe
                    </Text>
                    <Text style={{ color: "rgba(255,255,255,0.92)" }}>
                      {healthReminder.message ||
                        "Uống đủ nước, ngủ đủ giấc và duy trì khám sức khỏe định kỳ để theo dõi thể trạng tốt hơn."}
                    </Text>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Space>
      </div>

      <Modal
        title="Chi tiết lịch hẹn"
        open={appointmentModalOpen}
        onCancel={handleCloseAppointmentDetail}
        footer={null}
        width={isMobile ? "calc(100vw - 12px)" : 820}
        style={isMobile ? { top: 8, paddingBottom: 8 } : { top: 24 }}
        destroyOnClose
      >
        {appointmentLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : <AppointmentDetails appointment={appointmentDetail} />}
      </Modal>

      <VisitDetailModal
        open={detailOpen}
        onClose={handleCloseVisitDetail}
        selectedVisit={selectedVisit}
        loading={loadingVisitDetail}
        activeTab={activeDetailTab}
        onChangeTab={setActiveDetailTab}
        visitDetail={visitDetail}
        visitChiDinhs={visitChiDinhs}
        visitDonThuoc={visitDonThuoc}
        visitTaiLieus={visitTaiLieus}
        onViewDocument={handleOpenDocument}
        loadingDocumentId={loadingDocumentId}
      />

      <DocumentPreviewModal
        open={previewOpen}
        onClose={handleClosePreview}
        title={previewTitle}
        url={previewUrl}
      />
    </div>
  );
};

export default Tongquan;