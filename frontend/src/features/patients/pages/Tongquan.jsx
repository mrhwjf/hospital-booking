import React, { useState, useEffect } from "react";

const Tongquan = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Test endpoint - không cần auth, sử dụng bệnh nhân ID 1
      const response = await fetch("http://localhost:8000/api/v1/dashboard/patient/test/2");
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard API Response:", data); // Debug
      setDashboardData(data.data || data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Hàm format giờ
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // HH:mm format
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Đang tải dữ liệu...</div>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Lỗi tải dữ liệu</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>  
      </div>
    );
  }

  const patientInfo = dashboardData?.patient_info || {};
  const upcomingAppointments = dashboardData?.upcoming_appointments || [];
  const recentVisitHistory = dashboardData?.recent_visit_history || [];
  const healthProfile = dashboardData?.health_profile || {};
  const healthReminder = dashboardData?.health_reminder || {};

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-[#F8FAFC]">

      {/* HEADER */}
      <div>
        <h1 className="text-[28px] font-bold text-[#0F172A]">
          Chào mừng quay trở lại, {patientInfo.ho_ten || "Bệnh nhân"}
        </h1>
        <p className="text-gray-500">
          Hôm nay bạn cảm thấy thế nào? Xem các cập nhật mới nhất về sức khỏe của bạn.
        </p>
      </div>

      {/* THÔNG TIN NHANH */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Mã bệnh nhân */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#0F766E]">
              badge
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Mã bệnh nhân</p>  
            <p className="font-semibold text-[#0F172A]">{patientInfo.ma_benh_nhan || "N/A"}</p>
          </div>
        </div>

        {/* Nhóm máu */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#DC2626]">
              bloodtype
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Nhóm máu</p>
            <p className="font-semibold text-[#DC2626]">{patientInfo.nhom_mau || "N/A"}</p>
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* LỊCH HẸN */}
          <section>

            <h2 className="text-[20px] font-semibold flex items-center gap-2 text-[#0F172A] mb-4">
              <span className="material-symbols-outlined text-[#0F766E]">
                event
              </span>
              Lịch hẹn sắp tới
            </h2>

            {upcomingAppointments.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 shadow-sm text-center text-gray-500">
                Bạn không có lịch hẹn nào trong thời gian tới.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 shadow-sm">

                    <h3 className="font-semibold text-lg text-[#0F172A]">
                      {appointment.chuyen_khoa?.ten_chuyen_khoa || "Khám không xác định"}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {formatTime(appointment.gio_hen)} - {formatDate(appointment.ngay_hen)}
                    </p>

                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        BS. {appointment.bac_si?.ho_ten || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.chuyen_khoa?.ten_chuyen_khoa || "N/A"}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-2 text-xs">
                      {appointment.phong_kham && (
                        <>
                          <span className="bg-teal-100 text-[#0F766E] px-2 py-1 rounded">
                            {appointment.phong_kham.ten_phong}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {appointment.phong_kham.ma_phong}
                          </span>
                        </>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>

          {/* LỊCH SỬ KHÁM */}
          <section>

            <h2 className="text-[20px] font-semibold flex items-center gap-2 text-[#0F172A] mb-4">
              <span className="material-symbols-outlined text-[#0F766E]">
                history
              </span>
              Lịch sử khám gần đây
            </h2>

            {recentVisitHistory.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 shadow-sm text-center text-gray-500">
                Không có lịch sử khám gần đây.
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-[10px] overflow-hidden shadow-sm">

                <table className="w-full text-sm">

                  <thead className="bg-[#F8FAFC] text-gray-600">

                    <tr>
                      <th className="px-6 py-3 text-left">Ngày khám</th>
                      <th className="px-6 py-3 text-left">Dịch vụ</th>
                      <th className="px-6 py-3 text-left">Bác sĩ</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-right">Chi tiết</th>
                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {recentVisitHistory.map((visit) => (
                      <tr key={visit.id}>
                        <td className="px-6 py-4">{formatDate(visit.ngay_kham)}</td>
                        <td className="px-6 py-4">{visit.dich_vu || "N/A"}</td>
                        <td className="px-6 py-4">{visit.bac_si || "N/A"}</td>

                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-[#16A34A] px-3 py-1 rounded-full text-xs">
                            {visit.trang_thai || "Hoàn thành"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button className="text-[#0F766E] hover:text-[#0d5c56]">

                            <span className="material-symbols-outlined">
                              visibility
                            </span>

                          </button>

                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* HỒ SƠ SỨC KHỎE */}
          <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
              Hồ sơ sức khỏe
            </h3>

            <div className="space-y-4 text-sm text-gray-700">

              <div>
                <p className="font-medium mb-1">Tiền sử bệnh</p>
                <p className="text-gray-600">
                  {healthProfile.tien_su_benh || "Không có thông tin"}
                </p>
              </div>

              <div>
                <p className="font-medium mb-1">Dị ứng</p>
                <p className="text-gray-600">
                  {healthProfile.tien_su_di_ung || "Không có thông tin"}
                </p>
              </div>

            </div>

          </div>

          {/* NHẮC NHỞ SỨC KHỎE */}
          <div className="bg-[#0F766E] text-white rounded-[10px] p-6 shadow-md relative overflow-hidden">

            <h3 className="text-[20px] font-semibold mb-2">
              Nhắc nhở sức khỏe
            </h3>

            <p className="text-sm opacity-90 mb-4">
              {healthReminder.message || "Uống ít nhất 2 lít nước mỗi ngày và đừng quên kiểm tra sức khỏe định kỳ."}
            </p>

            <button className="bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg text-sm">
              Đã hiểu
            </button>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Tongquan;