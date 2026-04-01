import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalIcon from "./icon/HospitalIcon";
import MailIcon from "./icon/MailIcon";
import LockIcon from "./icon/LockIcon";
import EyeIcon from "./icon/EyeIcon";
import EyeOffIcon from "./icon/EyeOffIcon";
import { login } from "../../api/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", mat_khau: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.mat_khau);

      // Lưu token và thông tin người dùng
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("vai_tro", data.nguoi_dung.vai_tro);
      localStorage.setItem("user_id", data.nguoi_dung.id);
      localStorage.setItem("user_name", data.nguoi_dung.ho_ten);
      localStorage.setItem("payload", JSON.stringify(data.payload));

      const vaiTro = data.nguoi_dung.vai_tro;
      if (vaiTro === "ADMIN") {
        navigate(`/admin/${data.nguoi_dung.id}/dashboard`);
      } else if (vaiTro === "NHANVIEN") {
        navigate(`/staff/${data.nguoi_dung.id}/dashboard`);
      } else if (vaiTro === "BACSI") {
        navigate(`/doctor/${data.nguoi_dung.id}/dashboard`);
      } else {
        // Bệnh nhân - dùng route theo phiên đăng nhập, không truyền ID trên URL
        navigate("/patient/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f6f8f8] text-[#0e1b1a] antialiased">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden bg-[#0f756d]/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0f756d]/80 mix-blend-multiply z-10" />
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            aria-label="Modern clean hospital corridor with soft blue and teal lighting"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUyn_E1tsX5Vk2al2uQ7rMBJlsH6p1crHRx_tR6ICmFCxDtBUDWfaJrK0-1lIcUSJXgQZzelz-bKMXSskiy8_47vjYH4ki6A2j22-imX87pBpBSHsB5N1RAq7LuD3DzNNsk6LWVhKlnjP1HhMluD-ylmx1qu-Zf-V_7JQWFn2LVtiRHF7sNO0ryXBde7fFkhEXkBG4XCNNQhojWgyGUP-Ls0Q_2DvMsXZbDIVZ3U4Y1R-EVPiJ6K7Q7XnsPx-R-aMb3ezWTIntxko")',
            }}
          />
        </div>

        <div className="relative z-20 flex flex-col h-full justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <HospitalIcon className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              Hệ thống Y tế ABC
            </span>
          </div>

          <div className="mb-12 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Chăm sóc sức khỏe toàn diện
            </h1>
            <p className="text-white/90 text-lg font-semilight leading-relaxed">
              Nền tảng quản lý bệnh viện hiện đại, kết nối bác sĩ và bệnh nhân
              một cách hiệu quả và an toàn.
            </p>
          </div>

          <div className="flex gap-4 text-sm text-white/70">
            <span>© 2024 ABC Hospital System</span>
            <span>•</span>
            <a className="hover:text-white transition-colors" href="#">
              Điều khoản
            </a>
            <span>•</span>
            <a className="hover:text-white transition-colors" href="#">
              Bảo mật
            </a>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="lg:hidden flex items-center gap-2 mb-4 text-[#0f756d]">
            <HospitalIcon className="h-8 w-8" />
            <span className="text-xl font-bold">Hệ thống ABC</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[#0e1b1a] text-[32px] font-bold leading-tight tracking-tight">
              Kính chào quý khách
            </h2>
            <p className="text-[#4f9690] text-sm font-normal">
              Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                className="text-[#0e1b1a] text-base font-medium"
                htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="bacsi@benhvien.vn"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input flex w-full rounded-lg border border-[#d0e6e5] bg-[#f8fbfb] text-[#0e1b1a] h-14 px-4 pl-11 text-base placeholder:text-[#4f9690] focus:border-[#0f756d] focus:ring-1 focus:ring-[#0f756d] focus:outline-none transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#4f9690]">
                  <MailIcon className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-[#0e1b1a] text-base font-medium"
                htmlFor="mat_khau">
                Mật khẩu
              </label>
              <div className="relative flex w-full items-stretch rounded-lg">
                <input
                  id="mat_khau"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.mat_khau}
                  onChange={handleChange}
                  required
                  className="form-input flex w-full rounded-lg border border-[#d0e6e5] bg-[#f8fbfb] text-[#0e1b1a] h-14 px-4 pl-11 pr-12 text-base placeholder:text-[#4f9690] focus:border-[#0f756d] focus:ring-1 focus:ring-[#0f756d] focus:outline-none transition-all"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#4f9690]">
                  <LockIcon className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#4f9690] hover:text-[#0f756d] cursor-pointer transition-colors focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                  {showPassword ? (
                    <EyeOffIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-2 border-[#d0e6e5] bg-transparent text-[#0f756d] focus:ring-0 focus:ring-offset-0 focus:border-[#0f756d] transition-colors cursor-pointer checked:bg-[#0f756d] checked:border-[#0f756d]"
                />
                <span className="text-[#0e1b1a] text-sm font-normal group-hover:text-[#0f756d] transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                className="text-[#0f756d] hover:text-[#0a554f] text-sm font-medium transition-colors"
                href="#">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#0f756d] hover:bg-[#0a554f] text-white font-bold h-14 text-base transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#0f756d] cursor-pointer">
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="flex justify-center gap-1 text-base text-[#0e1b1a]">
            <p>Chưa có tài khoản?</p>
            <a
              className="font-bold text-[#0f756d] hover:text-[#0a554f] hover:underline transition-colors"
              href="/register">
              Đăng ký ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
