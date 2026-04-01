import { useEffect, useState, useCallback } from "react";
import { getPatientProfileTest, updatePatientProfile } from "../../../api/patientApi";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      // Test endpoint - sử dụng bệnh nhân ID 1
      const data = await getPatientProfileTest(1);
      
      if (data && data.data) {
        const profileData = data.data;
        // Format ngay_sinh để hiển thị đúng trong input date
        if (profileData.ngay_sinh) {
          profileData.ngay_sinh = profileData.ngay_sinh.split('T')[0]; // Lấy phần YYYY-MM-DD
        }
        setProfile(profileData || {});
      } else {
        setErrors({ general: "Lỗi tải hồ sơ" });
      }
    } catch (e) {
      console.error("Lỗi tải hồ sơ:", e);
      setErrors({ general: e.message || "Không thể tải hồ sơ. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!profile.ho_ten?.trim()) errs.ho_ten = "Họ tên là bắt buộc";
    if (!profile.so_dien_thoai?.trim()) errs.so_dien_thoai = "Số điện thoại là bắt buộc";
    if (!profile.ngay_sinh?.trim()) errs.ngay_sinh = "Ngày sinh là bắt buộc";
    if (profile.email?.trim()) {
      const re = /^[^\@\s]+@[^\@\s]+\.[^\@\s]+$/;
      if (!re.test(profile.email)) errs.email = "Vui lòng nhập email hợp lệ.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setSuccessMessage("");
      
      // Chuẩn bị dữ liệu trước khi gửi
      const dataToSave = { ...profile };
      
      // Gọi API update
      const res = await updatePatientProfile(dataToSave);
      
      if (res.data.success || res.data) {
        setEditing(false);
        setSuccessMessage("Cập nhật hồ sơ thành công!");
        
        // Clear success message sau 3 giây
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Cập nhật lại dữ liệu từ response
        const data = res.data.data || res.data;
        if (data.ngay_sinh) {
          data.ngay_sinh = data.ngay_sinh.split('T')[0];
        }
        setProfile(data);
      } else {
        setErrors({ general: res.data.message || "Lỗi cập nhật" });
      }
    } catch (e) {
      console.error("Lỗi lưu:", e);
      
      if (e.response?.status === 401) {
        setErrors({ general: "⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." });
      } else if (e.response?.status === 422) {
        setErrors({ general: "❌ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại." });
      } else {
        const errMsg = e.response?.data?.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.";
        setErrors({ general: errMsg });
      }
    } finally {
      setSaving(false);
    }
  }, [profile, validate]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setErrors({});
    setSuccessMessage("");
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-slate-600">Đang tải thông tin hồ sơ...</div>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-slate-900 mb-1";
  const errorClass = "text-red-600 text-xs mt-1";
  const cardClass = "bg-white border border-slate-200 rounded-lg p-6";

  return (
    <div className="p-6">
      {/* Success Banner */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 animate-pulse">
          ✓ {successMessage}
        </div>
      )}

      {/* Error Banner */}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {errors.general}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Hồ sơ bệnh nhân</h1>
          <p className="text-sm text-slate-600 mt-1">Quản lý và cập nhật thông tin chi tiết của bệnh nhân</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>✎</span> Cập nhật thông tin
          </button>
        )}
        {editing && (
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
        )}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}

        {/* Section 1: Thông tin cơ bản */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-teal-700">👤</span>
            <h2 className="text-lg font-semibold text-slate-900">Thông tin cơ bản</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Mã bệnh nhân (Read-only)</label>
              <input
                className={inputClass}
                type="text"
                name="ma_benh_nhan"
                value={profile.ma_benh_nhan || ""}
                disabled
              />
            </div>

            <div>
              <label className={labelClass}>Số CCCD</label>
              <input
                className={inputClass}
                type="text"
                name="so_cccd"
                value={profile.so_cccd || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập số CCCD (12 chữ số)"
                maxLength="12"
              />
            </div>

            <div>
              <label className={labelClass}>Họ tên</label>
              <input
                className={inputClass}
                type="text"
                name="ho_ten"
                value={profile.ho_ten || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập họ tên"
              />
              {errors.ho_ten && <p className={errorClass}>{errors.ho_ten}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Ngày sinh</label>
                <input
                  className={inputClass}
                  type="date"
                  name="ngay_sinh"
                  value={profile.ngay_sinh || ""}
                  disabled={!editing}
                  onChange={handleChange}
                />
                {errors.ngay_sinh && <p className={errorClass}>{errors.ngay_sinh}</p>}
              </div>
              <div>
                <label className={labelClass}>Giới tính</label>
                <select
                  className={inputClass}
                  name="gioi_tinh"
                  value={profile.gioi_tinh || ""}
                  disabled={!editing}
                  onChange={handleChange}
                >
                  <option value="">Chọn</option>
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Thông tin y tế */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-teal-700">⚕️</span>
            <h2 className="text-lg font-semibold text-slate-900">Thông tin y tế</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nhóm máu</label>
              <div className="flex gap-2 flex-wrap">
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((blood) => (
                  <button
                    key={blood}
                    onClick={() => {
                      if (editing) setProfile({ ...profile, nhom_mau: blood });
                    }}
                    disabled={!editing}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      profile.nhom_mau === blood
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-900 border border-slate-200"
                    } ${!editing ? "cursor-default" : "cursor-pointer hover:bg-slate-200"}`}
                  >
                    {blood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Tiền sử bệnh</label>
              <textarea
                className={inputClass}
                name="tien_su_benh"
                value={profile.tien_su_benh || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập tiền sử bệnh mãn tính (nếu có)"
                rows="3"
              />
            </div>

            <div>
              <label className={labelClass}>Tiền sử dị ứng</label>
              <textarea
                className={inputClass}
                name="tien_su_di_ung"
                value={profile.tien_su_di_ung || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập tiền sử dị ứng với thuốc hoặc thực phẩm"
                rows="3"
              />
            </div>

            <div>
              <label className={labelClass}>Ghi chú</label>
              <textarea
                className={inputClass}
                name="ghi_chu"
                value={profile.ghi_chu || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập ghi chú bổ sung"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        {/* Section 2: Thông tin liên hệ */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-teal-700">📞</span>
            <h2 className="text-lg font-semibold text-slate-900">Thông tin liên hệ</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Số điện thoại</label>
                <input
                  className={inputClass}
                  type="tel"
                  name="so_dien_thoai"
                  value={profile.so_dien_thoai || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  placeholder="0901 234 567"
                />
                {errors.so_dien_thoai && <p className={errorClass}>{errors.so_dien_thoai}</p>}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  disabled={!editing}
                  onChange={handleChange}
                  placeholder="user@example.com"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Địa chỉ</label>
              <textarea
                className={inputClass}
                name="dia_chi"
                value={profile.dia_chi || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Liên hệ khẩn cấp */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl text-teal-700">🆘</span>
            <h2 className="text-lg font-semibold text-slate-900">Liên hệ khẩn cấp</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Người liên hệ</label>
              <input
                className={inputClass}
                type="text"
                name="nguoi_lien_he"
                value={profile.nguoi_lien_he || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="Nhập tên người liên hệ"
              />
            </div>

            <div>
              <label className={labelClass}>Số điện thoại người liên hệ</label>
              <input
                className={inputClass}
                type="tel"
                name="sdt_nguoi_lien_he"
                value={profile.sdt_nguoi_lien_he || ""}
                disabled={!editing}
                onChange={handleChange}
                placeholder="0912 888 999"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Show when editing */}
      {editing && (
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Đang cập nhật...
              </>
            ) : (
              <>
                <span>✓</span>
                Cập nhật thông tin
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}