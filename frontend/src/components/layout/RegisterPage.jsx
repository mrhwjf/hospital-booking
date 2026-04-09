import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalIcon from "./icon/HospitalIcon";
import { register } from "../../api/authApi";
import { setStoredPermissions } from "../../utils/userProfileSync";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    email: "",
    mat_khau: "",
    mat_khau_confirmation: "",
    ngay_sinh: "",
    so_cccd: "",
    gioi_tinh: "nam",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      const data = await register(form);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("vai_tro", data.nguoi_dung.vai_tro);
      const permissions = Array.isArray(data?.nguoi_dung?.permissions)
        ? data.nguoi_dung.permissions
        : Array.isArray(data?.payload?.permissions)
          ? data.payload.permissions
          : [];
      setStoredPermissions(permissions);
      alert(`Chào mừng ${form.ho_ten} đã đến với Hệ Thống Y Tế ABC`);
      navigate("/login");
    } catch (err) {
      const resData = err?.response?.data;
      if (resData?.errors) {
        setFieldErrors(resData.errors);
      }
      setError(
        resData?.message || "Đăng ký thất bại. Vui lòng thử lòng thử lại",
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (field) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-600">{fieldErrors[field][0]}</p>
    ) : null;

  return (
    <div className="flex min-h-screen w-full bg-[#f6f8f8] text-slate-900 antialiased">
      <div className="relative hidden overflow-hidden bg-[#0f756d] lg:flex lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0f756d]/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0f756d]/80 via-transparent to-transparent z-20" />
          <img
            alt="Modern hospital interior with friendly staff"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCDr1MR7RA4qYiBJHe7bJTeLxrkk-bK7BsoArVmvvC9cmK9ctEdQ6Xke3qbxHSk0a3_l8kd5joL4xp2PRC8U5VpCJlIHAW6eIgI4_RaX7--3hzMOm_p61PgTxv_rlykOeOkIV4ZxiNUWQ6QLyZTBFTMOQ6eoT-7ngp9bTgM76YQEEq3aZEafOWu_GM0i7J5jSfsdCOgqHADpihMPxxoDAplprF7THNpMhTb7yqT9iR3Uv2CpVU2t7LTQ2stTZLti6QQaS5CYNQZqA"
          />
        </div>

        <div className="relative z-20 flex flex-col h-full justify-between p-12 text-white">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-fit items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-white/10 cursor-pointer"
          >
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <HospitalIcon className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              Hệ thống Y tế ABC
            </span>
          </button>

          <div className="mb-30 max-w-lg">
            <h1 className="mb-4 text-4xl font-black leading-tight">
              Chào mừng đến với Hệ thống Y tế ABC
            </h1>
            <p className="text-white/90 text-lg font-semilight leading-relaxed">
              Bắt đầu hành trình chăm sóc sức khỏe của bạn cùng đội ngũ chuyên
              gia hàng đầu và công nghệ y khoa hiện đại.
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-white/60">Đối tác tin cậy của</span>
            <span className="font-bold">Hơn 1.000.000 bệnh nhân</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-[#0f756d] transition hover:bg-[#e8f3f2] cursor-pointer"
            >
              <HospitalIcon className="h-6 w-6" />
              <span className="text-sm font-bold">Hệ thống ABC</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-[#b9ddda] px-3 py-1.5 text-xs font-semibold text-[#0f756d] transition hover:bg-[#e8f3f2] cursor-pointer"
            >
              ← Về trang chủ
            </button>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-black text-slate-900">
              Đăng ký tài khoản mới
            </h2>
            <p className="font-medium text-[#0f756d]/70">
              Vui lòng điền thông tin để bắt đầu sử dụng dịch vụ.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="ho_ten">
                Họ và tên
              </label>
              <input
                id="ho_ten"
                type="text"
                placeholder="Nguyễn Văn A"
                value={form.ho_ten}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
              />
              {fieldError("ho_ten")}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="so_dien_thoai">
                  Số điện thoại
                </label>
                <input
                  id="so_dien_thoai"
                  type="tel"
                  placeholder="0123 456 789"
                  value={form.so_dien_thoai}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
                {fieldError("so_dien_thoai")}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
                {fieldError("email")}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="mat_khau">
                  Mật khẩu
                </label>
                <input
                  id="mat_khau"
                  type="password"
                  placeholder="********"
                  value={form.mat_khau}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
                {fieldError("mat_khau")}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="mat_khau_confirmation">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="mat_khau_confirmation"
                  type="password"
                  placeholder="********"
                  value={form.mat_khau_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="ngay_sinh">
                  Ngày sinh
                </label>
                <input
                  id="ngay_sinh"
                  type="date"
                  value={form.ngay_sinh}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
                {fieldError("ngay_sinh")}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="so_cccd">
                  CCCD/Số hộ chiếu
                </label>
                <input
                  id="so_cccd"
                  type="text"
                  placeholder="00120000xxxx"
                  value={form.so_cccd}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
                {fieldError("so_cccd")}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-slate-700">
                Giới tính
              </label>
              <div className="flex gap-4">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                  <input
                    className="h-4 w-4"
                    type="radio"
                    name="gioi_tinh"
                    value="nam"
                    checked={form.gioi_tinh === "nam"}
                    onChange={handleChange}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Nam
                  </span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                  <input
                    className="h-4 w-4"
                    type="radio"
                    name="gioi_tinh"
                    value="nu"
                    checked={form.gioi_tinh === "nu"}
                    onChange={handleChange}
                  />
                  <span className="text-sm font-medium text-slate-700">Nữ</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                  <input
                    className="h-4 w-4"
                    type="radio"
                    name="gioi_tinh"
                    value="khac"
                    checked={form.gioi_tinh === "khac"}
                    onChange={handleChange}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Khác
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 ">
              <input
                id="terms"
                required
                type="checkbox"
                className="mt=0.5 h-4 w-4 rounded border-slate-300 cursor-pointer"
              />
              <label className="text-xs text-slate-500 cursor-pointer" htmlFor="terms">
                Tôi đồng ý với các điều khoản dịch vụ và chính sách bảo mật của
                ABC.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#0f756d] py-4 font-bold text-white shadow-lg shadow-[#0f756d]/20 transition-all hover:bg-[#0c615b] cursor-pointer">
              {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
            </button>

            <div className="pt-4 text-center">
              <p className="font-medium text-slate-600">
                Đã có tài khoản?
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="ml-1 font-bold text-[#0f756d] hover:underline cursor-pointer">
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
