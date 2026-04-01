import { useRef, useState } from "react";
import { Checkbox, ConfigProvider, Input, Modal } from "antd";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='64' fill='%23E2E8F0'/%3E%3Ccircle cx='64' cy='48' r='22' fill='%2394A3B8'/%3E%3Cpath d='M24 110c4-21 20-34 40-34s36 13 40 34' fill='%2394A3B8'/%3E%3C/svg%3E";

const INITIAL_PROFILE = {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
};

const INITIAL_PASSWORDS = {
  currentPassword: "Hoangphuong9812113",
  newPassword: "",
  confirmPassword: "",
};

const COLORS = {
  primary: "#0F766E",
  primaryHover: "#0c625c",
  secondary: "#2563EB",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#F59E0B",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  text: "#0F172A",
  border: "#E2E8F0",
  background: "#F8FAFC",
};

function Icon({ name, className = "h-5 w-5" }) {
  const sharedProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  switch (name) {
    case "hospital":
      return (
        <svg {...sharedProps}>
          <path d="M4 21V7.5A1.5 1.5 0 0 1 5.5 6H10v15" />
          <path d="M14 21V3.5A1.5 1.5 0 0 1 15.5 2h3A1.5 1.5 0 0 1 20 3.5V21" />
          <path d="M8 10h.01M8 13h.01M8 16h.01M17 6h.01M17 9h.01M17 12h.01" />
          <path d="M6.5 21h11" />
          <path d="M9 8V5m-1.5 1.5h3" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "user":
      return (
        <svg {...sharedProps}>
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case "message":
      return (
        <svg {...sharedProps}>
          <path d="M7 18 3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...sharedProps}>
          <path d="M10.3 3.3a1 1 0 0 1 1.4 0l.9.9a1 1 0 0 0 1 .24l1.23-.33a1 1 0 0 1 1.22.7l.34 1.23a1 1 0 0 0 .73.73l1.23.34a1 1 0 0 1 .7 1.22l-.33 1.23a1 1 0 0 0 .24 1l.9.9a1 1 0 0 1 0 1.4l-.9.9a1 1 0 0 0-.24 1l.33 1.23a1 1 0 0 1-.7 1.22l-1.23.34a1 1 0 0 0-.73.73l-.34 1.23a1 1 0 0 1-1.22.7l-1.23-.33a1 1 0 0 0-1 .24l-.9.9a1 1 0 0 1-1.4 0l-.9-.9a1 1 0 0 0-1-.24l-1.23.33a1 1 0 0 1-1.22-.7l-.34-1.23a1 1 0 0 0-.73-.73l-1.23-.34a1 1 0 0 1-.7-1.22l.33-1.23a1 1 0 0 0-.24-1l-.9-.9a1 1 0 0 1 0-1.4l.9-.9a1 1 0 0 0 .24-1l-.33-1.23a1 1 0 0 1 .7-1.22l1.23-.34a1 1 0 0 0 .73-.73l.34-1.23a1 1 0 0 1 1.22-.7l1.23.33a1 1 0 0 0 1-.24Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "bell":
      return (
        <svg {...sharedProps}>
          <path d="M15 17H5.5A1.5 1.5 0 0 1 4 15.5c0-.33.11-.66.31-.93L6 12V9a6 6 0 1 1 12 0v3l1.69 2.57c.2.27.31.6.31.93A1.5 1.5 0 0 1 18.5 17H15" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    case "help":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "camera":
      return (
        <svg {...sharedProps}>
          <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "edit":
      return (
        <svg {...sharedProps}>
          <path d="M12 20h9" />
          <path d="m16.5 3.5 4 4L8 20l-4 1 1-4Z" />
        </svg>
      );
    case "check":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "eye":
      return (
        <svg {...sharedProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "eye-off":
      return (
        <svg {...sharedProps}>
          <path d="m3 3 18 18" />
          <path d="M10.58 10.58A2 2 0 0 0 13.4 13.4" />
          <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a17.56 17.56 0 0 1-3.06 3.77" />
          <path d="M6.71 6.7C4.24 8.18 2.5 12 2.5 12a17.44 17.44 0 0 0 6.13 5.24" />
        </svg>
      );
    case "trash":
      return (
        <svg {...sharedProps}>
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    default:
      return null;
  }
}

function PasswordField({
  label,
  name,
  value,
  visible,
  onChange,
  onToggle,
  hasError = false,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="********"
          className={[
            "w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition",
            hasError
              ? "border-[#DC2626] focus:border-[#DC2626]"
              : "border-[#E2E8F0] focus:border-[#0F766E]",
          ].join(" ")}
          style={{ color: COLORS.text }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
          <Icon name={visible ? "eye" : "eye-off"} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [avatarSrc, setAvatarSrc] = useState(DEFAULT_AVATAR);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const fileInputRef = useRef(null);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setProfileMessage("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordError("");
    setPasswordMessage("");
  };

  const handleAvatarUpload = (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarSrc((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return objectUrl;
    });
    setProfileMessage("Ảnh đại diện đã được cập nhật.");
  };

  const handleAvatarReset = () => {
    setAvatarSrc((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return DEFAULT_AVATAR;
    });
    setProfileMessage("Đã khôi phục ảnh đại diện mặc định.");
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setProfileMessage("Cập nhật thông tin thành công!");
  };

  const handleOpenEmailModal = () => {
    setNewEmail(profile.email);
    setEmailConfirmed(false);
    setEmailError("");
    setIsEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
    setEmailError("");
  };

  const handleEmailSubmit = () => {
    const trimmedEmail = newEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Email không hợp lệ.");
      return;
    }

    if (!emailConfirmed) {
      setEmailError("Vui lòng xác nhận thay đổi email.");
      return;
    }

    setProfile((current) => ({ ...current, email: trimmedEmail }));
    setProfileMessage("Cập nhật email thành công!");
    setIsEmailModalOpen(false);
    setEmailError("");
  };

  const handleOpenPasswordModal = () => {
    setPasswordError("");
    setPasswordMessage("");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError("");
  };

  const handlePasswordSubmit = (event) => {
    event?.preventDefault?.();

    if (!/[A-Z]/.test(passwords.newPassword)) {
      setPasswordError("Mật khẩu phải chứa ít nhất 1 chữ hoa.");
      setPasswordMessage("");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      setPasswordMessage("");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      setPasswordMessage("");
      return;
    }

    setPasswordError("");
    setPasswordMessage("Mật khẩu đã được cập nhật.");
    setPasswords(INITIAL_PASSWORDS);
    setIsPasswordModalOpen(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 md:px-8"
      style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      <main className="w-full max-w-4xl space-y-8">
        <section
          className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          style={{ borderColor: COLORS.border }}>
          <div className="border-b p-6" style={{ borderColor: COLORS.border }}>
            <h3 className="text-lg font-bold">Thông tin tài khoản</h3>
            <p className="text-sm text-slate-500">
              Cập nhật thông tin tài khoản để chúng tôi có thể phục vụ tốt hơn.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-8 p-6 md:p-8">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg">
                  <img
                    src={avatarSrc}
                    alt="Ảnh đại diện"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full p-2 text-white shadow-lg transition hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: COLORS.primary }}
                  aria-label="Tải lên ảnh đại diện">
                  <Icon name="camera" className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold">Ảnh đại diện</h4>
                <p className="text-sm text-slate-500">
                  Hỗ trợ định dạng JPG, PNG. Dung lượng tối đa 2MB.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border px-3 py-1 text-sm font-semibold transition hover:bg-[#effaf8] cursor-pointer"
                    style={{
                      borderColor: COLORS.primary,
                      color: COLORS.primary,
                    }}>
                    Tải lên
                  </button>
                  <button
                    type="button"
                    onClick={handleAvatarReset}
                    className="rounded-lg border px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 cursor-pointer"
                    style={{ borderColor: COLORS.border }}>
                    Xóa
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Email:
                  </span>
                  <span className="text-sm text-slate-600">
                    {profile.email}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-slate-500 transition hover:text-slate-700"
                  aria-label="Chỉnh sửa email"
                  onClick={handleOpenEmailModal}>
                  <Icon name="edit" className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Mật khẩu hiện tại:
                  </span>
                  <span className="text-sm text-slate-600">
                    ***************
                  </span>
                </div>
                <button
                  type="button"
                  className="text-slate-500 transition hover:text-slate-700"
                  aria-label="Chỉnh sửa mật khẩu"
                  onClick={handleOpenPasswordModal}>
                  <Icon name="edit" className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLORS.primary,
          },
        }}>
        <Modal
          title="Đổi email"
          open={isEmailModalOpen}
          onOk={handleEmailSubmit}
          onCancel={handleCloseEmailModal}
          okText="Cập nhật"
          okButtonProps={{
            style: {
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
            },
          }}
          cancelText="Hủy">
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Nhập mật email mới
              </label>
              <Input
                value={newEmail}
                onChange={(event) => {
                  setNewEmail(event.target.value);
                  setEmailError("");
                }}
                placeholder="Nhập email mới"
              />
            </div>

            <Checkbox
              checked={emailConfirmed}
              onChange={(event) => {
                setEmailConfirmed(event.target.checked);
                setEmailError("");
              }}>
              Xác nhận thay đổi email
            </Checkbox>

            {emailError ? (
              <p className="text-xs" style={{ color: COLORS.danger }}>
                {emailError}
              </p>
            ) : null}
          </div>
        </Modal>

        <Modal
          title="Đổi mật khẩu"
          open={isPasswordModalOpen}
          onOk={handlePasswordSubmit}
          onCancel={handleClosePasswordModal}
          okText="Cập nhật"
          okButtonProps={{
            style: {
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
            },
          }}
          cancelText="Hủy">
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Mật khẩu hiện tại
              </label>
              <Input.Password
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Nhập mật khẩu mới
              </label>
              <Input.Password
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Xác nhận mật khẩu mới
              </label>
              <Input.Password
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            {passwordError ? (
              <p className="text-xs" style={{ color: COLORS.danger }}>
                {passwordError}
              </p>
            ) : null}
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default Profile;
