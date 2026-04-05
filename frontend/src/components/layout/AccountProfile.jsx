import { useEffect, useRef, useState } from "react";
import { Checkbox, ConfigProvider, Input, Modal } from "antd";
import {
  changePassword,
  getMe,
  updateMe,
  updateAvatar,
} from "../../api/authApi";
import {
  getStoredUserAvatar,
  setStoredUserProfile,
  subscribeUserProfileUpdates,
} from "../../utils/userProfileSync";

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='64' fill='%23E2E8F0'/%3E%3Ccircle cx='64' cy='48' r='22' fill='%2394A3B8'/%3E%3Cpath d='M24 110c4-21 20-34 40-34s36 13 40 34' fill='%2394A3B8'/%3E%3C/svg%3E";

const normalizeAvatar = (avatarUrl) =>
  typeof avatarUrl === "string" ? avatarUrl.trim() : "";

const INITIAL_PROFILE = {
  fullName: "",
  email: "",
};

const INITIAL_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const COLORS = {
  primary: "#0F766E",
  danger: "#DC2626",
  border: "#E2E8F0",
  background: "#F8FAFC",
  text: "#0F172A",
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
    default:
      return null;
  }
}

function AccountProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [avatarSrc, setAvatarSrc] = useState(() => {
    const storedAvatar = normalizeAvatar(getStoredUserAvatar());
    return storedAvatar || DEFAULT_AVATAR;
  });

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const syncAvatarFromStorage = () => {
      const latestAvatar = normalizeAvatar(getStoredUserAvatar());
      setAvatarSrc(latestAvatar || DEFAULT_AVATAR);
    };

    const unsubscribe = subscribeUserProfileUpdates(syncAvatarFromStorage);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoadingAccount(true);
        const me = await getMe();
        const latestAvatar = normalizeAvatar(me?.hinh_anh);
        setProfile({
          fullName: me?.ho_ten || "",
          email: me?.email || "",
        });
        setAvatarSrc(latestAvatar || DEFAULT_AVATAR);
        setStoredUserProfile({
          userName: me?.ho_ten,
          avatarUrl: latestAvatar,
        });
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          "Không thể tải thông tin tài khoản. Vui lòng tải lại trang.";
        setProfileMessage(msg);
      } finally {
        setLoadingAccount(false);
      }
    };

    loadAccount();
  }, []);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordError("");
    setPasswordMessage("");
  };

  const handleAvatarUpload = (event) => {
    const [file] = event.target.files || [];
    if (!file) return;

    const response = updateAvatar(file);
    response
      .then((data) => {
        const latestAvatar = normalizeAvatar(data?.url);
        setAvatarSrc(latestAvatar || DEFAULT_AVATAR);
        setStoredUserProfile({ avatarUrl: latestAvatar });
        setProfileMessage("Ảnh đại diện đã được cập nhật.");
      })
      .catch((error) => {
        const msg =
          error?.response?.data?.message ||
          "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.";
        setProfileMessage(msg);
      });

    // Reset input value to allow re-uploading the same file if needed
    event.target.value = "";
  };

  const handleAvatarReset = () => {
    setAvatarSrc((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return DEFAULT_AVATAR;
    });
    setStoredUserProfile({ avatarUrl: "" });
    setProfileMessage("Đã khôi phục ảnh đại diện mặc định.");
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

  const handleEmailSubmit = async () => {
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

    try {
      setSavingEmail(true);
      const updated = await updateMe({ email: trimmedEmail });

      setProfile((current) => ({
        ...current,
        email: updated?.email || trimmedEmail,
      }));
      setProfileMessage("Cập nhật email thành công!");
      setIsEmailModalOpen(false);
      setEmailError("");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.email?.[0] ||
        "Không thể cập nhật email.";
      setEmailError(msg);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordError("");
    setPasswordMessage("");
    setPasswords(INITIAL_PASSWORDS);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError("");
  };

  const handlePasswordSubmit = async (event) => {
    event?.preventDefault?.();

    if (!passwords.currentPassword) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!/[A-Z]/.test(passwords.newPassword)) {
      setPasswordError("Mật khẩu mới phải chứa ít nhất 1 chữ hoa.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword,
      });

      setPasswordError("");
      setPasswordMessage("Mật khẩu đã được cập nhật.");
      setPasswords(INITIAL_PASSWORDS);
      setIsPasswordModalOpen(false);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.new_password?.[0] ||
        "Không thể đổi mật khẩu.";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-slate-600">
          Đang tải thông tin tài khoản...
        </div>
      </div>
    );
  }

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
              Xem và cập nhật thông tin tài khoản của bạn. Bạn có thể thay đổi email, mật khẩu và ảnh đại diện tại đây.
            </p>
          </div>

          <div className="space-y-8 p-6 md:p-8">
            {profileMessage ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
                {profileMessage}
              </div>
            ) : null}
            {passwordMessage ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
                {passwordMessage}
              </div>
            ) : null}

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
                  Hỗ trợ định dạng JPG, PNG. Dung lượng tối đa 5MB.
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
                    {profile.email || "Chưa có email"}
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
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">
                      Mật khẩu:
                    </span>
                    <span className="text-sm text-slate-600">••••••••••••</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Mật khẩu không thể hiển thị vì hệ thống lưu dưới dạng mã
                    hóa.
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
          </div>
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
          confirmLoading={savingEmail}
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
                Nhập email mới
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
          confirmLoading={savingPassword}
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

export default AccountProfile;
