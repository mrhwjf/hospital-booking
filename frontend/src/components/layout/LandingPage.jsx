import { useEffect, useState } from "react";
import { Avatar, Dropdown } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import HeartIcon from "./icon/HeartIcon";
import BabyIcon from "./icon/BabyIcon";
import PillsIcon from "./icon/PillsIcon";
import BoneIcon from "./icon/BoneIcon";
import HospitalIcon from "./icon/HospitalIcon";
import { useNavigate } from "react-router-dom";
import PregnantWomanIcon from "./icon/PregnantWomanIcon.png";
import SkinIcon from "./icon/SkinIcon.png";
import EarIcon from "./icon/EarIcon.png";
import StomachIcon from "./icon/StomachIcon.png";
import { getMe } from "../../api/authApi";
import {
  clearStoredAuthState,
  getStoredAuthToken,
  getStoredUserAvatar,
  getStoredUserName,
  setStoredUserProfile,
  subscribeUserProfileUpdates,
} from "../../utils/userProfileSync";

const getAuthSnapshot = () => {
  const token = getStoredAuthToken();
  const userName = getStoredUserName() || "Người dùng";
  const avatarUrl = getStoredUserAvatar();

  return {
    isAuthenticated: Boolean(token),
    userName,
    avatarUrl,
  };
};

const getAvatarContent = (userName) => {
  const trimmedName = userName?.trim();
  if (!trimmedName) {
    return <UserOutlined />;
  }

  return trimmedName.charAt(0).toUpperCase();
};

const specialties = [
  {
    id: "01",
    icon: <HeartIcon />,
    title: "Tim mạch",
    description: "Khám và điều trị các bệnh lý về tim mạch, huyết áp.",
  },
  {
    id: "02",
    icon: <BabyIcon />,
    title: "Nhi khoa",
    description: "Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh và trẻ nhỏ.",
  },
  {
    id: "03",
    icon: (
      <img
        src={PregnantWomanIcon}
        alt="Sản phụ khoa"
        className="h-6 w-6 object-contain"
      />
    ),
    title: "Sản phụ khoa",
    description: "Theo dõi thai kỳ và điều trị các bệnh lý phụ khoa.",
  },
  {
    id: "04",
    icon: <PillsIcon />,
    title: "Nội tổng quát",
    description: "Chẩn đóan và điều trị các bệnh lý nội khoa thông thường.",
  },
  {
    id: "05",
    icon: (
      <img src={SkinIcon} alt="Da liễu" className="h-6 w-6 object-contain" />
    ),
    title: "Da liễu",
    description: "Điều trị mụn, nám và các bệnh lý da liễu thẩm mỹ.",
  },
  {
    id: "06",
    icon: (
      <img
        src={EarIcon}
        alt="Tai mũi Họng"
        className="h-6 w-6 object-contain"
      />
    ),
    title: "Tai mũi Họng",
    description: "Khám chữa các bệnh lý về tai, mũi, họng cho mọi lứa tuổi.",
  },
  {
    id: "07",
    icon: <BoneIcon />,
    title: "Chấn thương chỉnh hình",
    description: "Xử lý gãy xương, trị khớp và các chấn thương vận động.",
  },
  {
    id: "08",
    icon: (
      <img
        src={StomachIcon}
        alt="Tiêu hóa"
        className="h-6 w-6 object-contain"
      />
    ),
    title: "Tiêu hóa",
    description: "Nội soi dạ dày, đại tràng và điều trị các bệnh lý tiêu hóa.",
  },
];

const doctors = [
  {
    specialty: "Tim mạch",
    name: "ThS. BS Nguyễn Văn A",
    bio: "15 năm kinh nghiệm điều trị các bệnh lý tim mạch.",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  },
  {
    specialty: "Nhi khoa",
    name: "BS.CKI Trần Thị B",
    bio: "Trường khoa Nhi, chuyên gia dinh dưỡng trẻ em.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    specialty: "Chấn thương chỉnh hình",
    name: "TS. BS Lê Văn C",
    bio: "Chuyên gia phẫu thuật nội soi khớp và chấn thương thể thao.",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
  {
    specialty: "Da liễu",
    name: "BS.CKII Phạm Thị D",
    bio: "20 năm kinh nghiệm điều trị các bệnh lý về da.",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
  },
];

const stats = [
  { value: "20+", label: "Năm kinh nghiệm" },
  { value: "50k+", label: "Lượt khám/năm" },
  { value: "100+", label: "Bác sĩ chuyên khoa" },
  { value: "24/7", label: "Hỗ trợ y tế" },
];
function LandingPage() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getAuthSnapshot);

  useEffect(() => {
    const syncAuthState = () => {
      setAuthState(getAuthSnapshot());
    };

    syncAuthState();
    const unsubscribe = subscribeUserProfileUpdates(syncAuthState);

    const token = getStoredAuthToken();
    if (token && (!getStoredUserAvatar() || !getStoredUserName())) {
      getMe()
        .then((me) => {
          setStoredUserProfile({
            userName: me?.ho_ten,
            avatarUrl: me?.hinh_anh,
          });
        })
        .catch(() => {
          // Do not block landing rendering if profile prefetch fails.
        });
    }

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    clearStoredAuthState();
    navigate("/login");
  };

  const profileMenuItems = [
    {
      key: "dashboard",
      label: "Trang tổng quan",
      onClick: () => navigate("/patient/dashboard"),
    },
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/patient/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f5f5] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-md bg-emerald-700 text-white flex items-center justify-center">
              <HospitalIcon className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">
              Hệ thống Y tế ABC
            </h1>
          </div>
          <nav className="hidden items-center gap-5 lg:flex">
            <a
              href="#"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
              Chuyên khoa
            </a>
            <a
              href="#"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
              Bác sĩ
            </a>
            <a
              href="#"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
              Dịch vụ
            </a>
            <a
              href="#"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
              Hỗ trợ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {authState.isAuthenticated ? (
              <Dropdown
                menu={{ items: profileMenuItems }}
                trigger={["click"]}
                placement="bottomRight">
                <button
                  type="button"
                  className="rounded-full border border-emerald-200 p-0.5 hover:border-emerald-300 cursor-pointer"
                  aria-label="Mở menu tài khoản">
                  <Avatar
                    size={34}
                    src={authState.avatarUrl || undefined}
                    className="bg-emerald-700">
                    {!authState.avatarUrl
                      ? getAvatarContent(authState.userName)
                      : null}
                  </Avatar>
                </button>
              </Dropdown>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-md border border-emerald-700 px-5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer">
                  Đăng ký
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-md bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 cursor-pointer">
                  Đăng nhập
                </button>
              </>
            )}
            <button className="rounded-md border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-700 cursor-pointer">
              1900 1234
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
          <div
            className="relative overflow-hidden rounded-xl bg-cover bg-center px-6 py-16 md:px-10 md:py-20"
            style={{
              backgroundImage:
                'linear-gradient(95deg, rgba(14,95,87,0.9) 20%, rgba(16,185,129,0.3) 100%), url("https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1600&q=80")',
            }}>
            <div className="max-w-xl">
              <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
                Chăm sóc sức khỏe
                <br />
                tận tâm
              </h2>
              <p className="mt-3 text-sm text-emerald-50 md:text-base">
                Hệ thống y tế hàng đầu Việt Nam với đội ngũ bác sĩ chuyên môn
                cao.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(authState.isAuthenticated ? "/patient/dat-lich" : "/login")
                  }
                  className="rounded-md bg-white px-4 py-2 text-xs font-bold text-emerald-800 md:text-sm cursor-pointer">
                  Đặt lịch ngay
                </button>
                <button className="rounded-md border border-white/50 bg-white/15 px-4 py-2 text-xs font-bold text-white md:text-sm cursor-pointer">
                  Tra cứu lịch hẹn
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Chuyên khoa nổi bật
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Đa dạng chuyên khoa với trang thiết bị hiện đại
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {specialties.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl hover:shadow-xl transition-shadow duration-300">
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-emerald-50 text-xs font-black text-emerald-700">
                  {item.icon}
                </div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-10">
          <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-black text-slate-900">
                Đội ngũ bác sĩ tiêu biểu
              </h3>
              <p className="mx-auto mt-1 max-w-xl text-sm text-slate-600">
                Các chuyên gia y tế hàng đầu với nhiều năm kinh nghiệm, tận tâm
                vì sức khỏe của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
                <article
                  key={doctor.name}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {doctor.specialty}
                    </p>
                    <h4 className="mt-1 text-sm font-black text-slate-900">
                      {doctor.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">{doctor.bio}</p>
                    <button
                      className="mt-3 w-full rounded-md border border-emerald-600 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-700 hover:text-white cursor-pointer"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }>
                      Đặt khám ngay
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-700 py-8 text-white">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-4 text-center md:grid-cols-4 lg:px-6">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-4xl font-black">{item.value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f7f8f8]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 text-xs text-slate-600 md:grid-cols-4 lg:px-6">
          <div>
            <p className="text-sm font-black text-slate-900">
              Hệ thống Y tế ABC
            </p>
            <p className="mt-2 leading-5">
              Cung cấp dịch vụ y tế chất lượng cao, tận tâm vì sức khỏe cộng
              đồng.
            </p>
          </div>
          <div>
            <p className="font-black text-slate-800">Về chúng tôi</p>
            <ul className="mt-2 space-y-1.5">
              <li>Giới thiệu</li>
              <li>Đội ngũ bác sĩ</li>
              <li>Cơ sở vật chất</li>
              <li>Tuyển dụng</li>
            </ul>
          </div>
          <div>
            <p className="font-black text-slate-800">Dịch vụ</p>
            <ul className="mt-2 space-y-1.5">
              <li>Đặt lịch khám</li>
              <li>Gói khám sức khỏe</li>
              <li>Bảo hiểm y tế</li>
              <li>Hỏi đáp y khoa</li>
            </ul>
          </div>
          <div>
            <p className="font-black text-slate-800">Liên hệ</p>
            <ul className="mt-2 space-y-1.5">
              <li>123 Nguyễn Văn Cừ, Quận 5, TP.HCM</li>
              <li>1900 1234</li>
              <li>cskh@yteabc.vn</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-3 text-center text-[11px] text-slate-500">
          © 2026 Hệ thống Y tế ABC. Bảo lưu mọi quyền.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
