import { useNavigate } from "react-router-dom";
import HospitalIcon from "./icon/HospitalIcon";

function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f6f8f8] text-slate-900 antialiased">
      <div className="relative hidden overflow-hidden bg-[#0f756d] lg:flex lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0f756d]/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f756d]/80 via-transparent to-transparent z-20" />
          <img
            alt="Modern hospital interior with friendly staff"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCDr1MR7RA4qYiBJHe7bJTeLxrkk-bK7BsoArVmvvC9cmK9ctEdQ6Xke3qbxHSk0a3_l8kd5joL4xp2PRC8U5VpCJlIHAW6eIgI4_RaX7--3hzMOm_p61PgTxv_rlykOeOkIV4ZxiNUWQ6QLyZTBFTMOQ6eoT-7ngp9bTgM76YQEEq3aZEafOWu_GM0i7J5jSfsdCOgqHADpihMPxxoDAplprF7THNpMhTb7yqT9iR3Uv2CpVU2t7LTQ2stTZLti6QQaS5CYNQZqA"
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

          <div className="mb-50 max-w-lg">
            <h1 className="mb-4 text-4xl font-black leading-tight font-bold">
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
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-black text-slate-900">
              Đăng ký tài khoản mới
            </h2>
            <p className="font-medium text-[#0f756d]/70">
              Vui lòng điền thông tin để bắt đầu sử dụng dịch vụ.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="fullName">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="phoneNumber">
                  Số điện thoại
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="0123 456 789"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
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
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="dob">
                  Ngày sinh
                </label>
                <input
                  id="dob"
                  type="date"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="idNumber">
                  CCCD/Số hộ chiếu
                </label>
                <input
                  id="idNumber"
                  type="text"
                  placeholder="00120000xxxx"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-[#0f756d] focus:ring-2 focus:ring-[#0f756d]"
                />
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
                    name="gender"
                    value="Nam"
                    defaultChecked
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Nam
                  </span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                  <input
                    className="h-4 w-4"
                    type="radio"
                    name="gender"
                    value="Nu"
                  />
                  <span className="text-sm font-medium text-slate-700">Nữ</span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50">
                  <input
                    className="h-4 w-4"
                    type="radio"
                    name="gender"
                    value="Khac"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Khác
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="terms"
                required
                type="checkbox"
                className="mt=0.5 h-4 w-4 rounded border-slate-300 cursor-pointer"
              />
              <label className="text-xs text-slate-500" htmlFor="terms">
                Tôi đồng ý với các điều khoản dịch vụ và chính sách bảo mật của
                ABC.
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-[#0f756d] py-4 font-bold text-white shadow-lg shadow-[#0f756d]/20 transition-all hover:bg-[#0c615b] cursor-pointer">
              Đăng ký tài khoản
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
