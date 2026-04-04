import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
  ScheduleOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Grid, Layout, Menu, Space, Tag, Typography, message } from 'antd'
import { MENU_CONFIG } from '../../app/menuConfig'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const PATIENT_MENU_ITEMS = MENU_CONFIG.PATIENT

const patientIconMap = {
  calendar: <CalendarOutlined />,
  schedule: <ScheduleOutlined />,
  file: <FileTextOutlined />,
  user: <UserOutlined />,
  logout: <LogoutOutlined />,
}

const getSelectedRoute = (pathname) => {
  const matched = PATIENT_MENU_ITEMS.find((item) => pathname.startsWith(item.route))
  return matched?.route || '/patient/dat-lich'
}

export default function PatientLayout({ patientName = 'Bệnh nhân', children }) {
  const screens = useBreakpoint()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const isMobile = !screens.lg
  const selectedRoute = getSelectedRoute(location.pathname)

  const mainMenuItems = useMemo(
    () =>
      PATIENT_MENU_ITEMS.filter((item) => item.icon !== 'logout').map((item) => ({
        key: item.route,
        icon: patientIconMap[item.icon] || <FileTextOutlined />,
        label: item.label,
      })),
    [],
  )

  const logoutItem = useMemo(() => {
    const item = PATIENT_MENU_ITEMS.find((menuItem) => menuItem.icon === 'logout')
    if (!item) {
      return null
    }

    return {
      key: item.route,
      icon: <LogoutOutlined />,
      label: item.label,
      className: 'text-red-500! hover:bg-red-50!',
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    message.success('Đã đăng xuất khỏi khu vực bệnh nhân.')
    navigate('/', { replace: true })
  }

  const handleMenuClick = ({ key }) => {
    if (key === '/patient/logout') {
      handleLogout()
      return
    }

    navigate(key)
    setDrawerOpen(false)
  }

  const navMenu = (
    <div className="flex h-full flex-col">
      <Menu
        mode="inline"
        selectedKeys={selectedRoute ? [selectedRoute] : []}
        onClick={handleMenuClick}
        items={mainMenuItems}
        className="flex-1 border-0"
      />

      {logoutItem ? (
        <div className="border-t border-slate-200 p-2">
          <Menu
            mode="inline"
            selectedKeys={selectedRoute ? [selectedRoute] : []}
            onClick={handleMenuClick}
            items={[logoutItem]}
            className="border-0"
          />
        </div>
      ) : null}
    </div>
  )

  return (
    <Layout className="h-screen overflow-hidden bg-slate-50">
      <Header
        className="z-20 flex h-16 items-center justify-between border-b-4 border-[#E2E8F0]! bg-white! px-4! md:px-6!"
      >
        <Space size={12} align="center">
          {isMobile ? (
            <Button type="text" icon={<MenuOutlined style={{ color: '#ffffff' }} />} onClick={() => setDrawerOpen(true)} />
          ) : null}
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-2xl text-[#0F766E]" />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Title level={4} className="mb-0! text-[#0F766E]!">
                Hospital Booking
              </Title>
              <div className="my-1 h-0.5 w-full bg-gray-300 sm:mx-2 sm:my-0 sm:h-6 sm:w-0.5" />
              <Text type="secondary">Cổng Bệnh Nhân</Text>
            </div>
          </div>
        </Space>

        <Space size={10} align="center">
          <Tag color="cyan" style={{ borderRadius: 999, margin: 0 }}>
            Vai trò: BỆNH NHÂN
          </Tag>
          <Avatar icon={<UserOutlined />} style={{ background: '#ffffff', color: '#0F766E' }} />
          <Text style={{ color: '#ffffff' }}>{patientName}</Text>
        </Space>
      </Header>

      <Layout className="h-[calc(100vh-72px)] overflow-hidden">
        {!isMobile ? (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={250}
            theme="light"
            className="h-full overflow-hidden border-r border-slate-200 bg-white"
          >
            <div className="h-full py-3">{navMenu}</div>
          </Sider>
        ) : null}

        <Content className="h-full overflow-y-auto p-4 md:p-6" style={{ background: '#F8FAFC' }}>
          <div
            style={{
              borderRadius: 14,
              background: '#ffffff',
              padding: 16,
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
            }}
          >
            {children || <Outlet />}
          </div>
        </Content>
      </Layout>

      <Drawer
        title="Điều hướng"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        {navMenu}
      </Drawer>
    </Layout>
  )

// CONTENT WILL BE USED FOR POST-MERGE FIXES

// import { useEffect, useState } from "react";
// import { Dropdown, Avatar } from "antd";
// import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
// import { Link, useLocation, Outlet } from "react-router-dom";
// import { getMe } from "../../api/authApi";
// import {
//   clearStoredAuthState,
//   getStoredAuthToken,
//   getStoredUserAvatar,
//   getStoredUserName,
//   setStoredUserProfile,
//   subscribeUserProfileUpdates,
// } from "../../utils/userProfileSync";

// export default function PatientLayout() {
//   const location = useLocation();
//   const [avatarUrl, setAvatarUrl] = useState(getStoredUserAvatar);
//   const [userName, setUserName] = useState(getStoredUserName);

//   useEffect(() => {
//     const syncProfile = () => {
//       setAvatarUrl(getStoredUserAvatar());
//       setUserName(getStoredUserName());
//     };

//     syncProfile();
//     const unsubscribe = subscribeUserProfileUpdates(syncProfile);

//     const token = getStoredAuthToken();
//     if (token && (!getStoredUserAvatar() || !getStoredUserName())) {
//       getMe()
//         .then((me) => {
//           setStoredUserProfile({
//             userName: me?.ho_ten,
//             avatarUrl: me?.hinh_anh,
//           });
//         })
//         .catch(() => {
//           // Keep layout responsive even if profile bootstrap fails.
//         });
//     }

//     return unsubscribe;
//   }, []);

//   const getAvatarFallback = () => {
//     const trimmedName = userName?.trim();
//     if (!trimmedName) {
//       return <UserOutlined />;
//     }

//     return trimmedName.charAt(0).toUpperCase();
//   };

//   // Menu items cho Profile dropdown
//   const profileMenuItems = [
//     {
//       key: "1",
//       label: "Thông tin cá nhân",
//       onClick: () => (window.location.href = "/patient/profile"),
//     },
//     {
//       key: "2",
//       label: "Thông tin tài khoản",
//       onClick: () => (window.location.href = "/patient/account"),
//     },
//     {
//       type: "divider",
//     },
//     {
//       key: "3",
//       label: "Đăng xuất",
//       icon: <LogoutOutlined />,
//       danger: true,
//       onClick: () => {
//         clearStoredAuthState();
//         window.location.href = "/login";
//       },
//     },
//   ];

//   // Menu items cho Navigation dropdown (Hồ sơ)
//   const profileNavMenuItems = [
//     {
//       key: "1",
//       label: "Thông tin cá nhân",
//       onClick: () => (window.location.href = "/patient/profile"),
//     },
//     {
//       key: "2",
//       label: "Thông tin tài khoản",
//       onClick: () => (window.location.href = "/patient/account"),
//     },
//   ];

//   // Menu items cho Khám phá dropdown
//   const exploreMenuItems = [
//     {
//       key: "1",
//       label: "Chuyên khoa & Bác sĩ",
//       onClick: () => (window.location.href = "/explore"),
//     },
//     {
//       key: "2",
//       label: "Dịch vụ & Gói khám",
//       onClick: () => (window.location.href = "/services"),
//     },
//   ];

//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + "/");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//               <img
//                 src="/logo3.png"
//                 alt="Healthcare Logo"
//                 className="h-65 w-auto"
//               />
//             </Link>

//             {/* Navigation - Căn phải */}
//             <nav className="hidden md:flex items-center gap-6 ml-auto mr-6">
//               <Link
//                 to="/"
//                 className={`text-sm font-medium transition-colors ${
//                   isActive("/") && location.pathname === "/"
//                     ? "text-teal-700"
//                     : "text-gray-600 hover:text-teal-700"
//                 }`}>
//                 Giới thiệu
//               </Link>

//               {/* Khám phá Dropdown */}
//               <Dropdown menu={{ items: exploreMenuItems }} trigger={["click"]}>
//                 <button
//                   className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
//                     isActive("/explore") || isActive("/services")
//                       ? "text-teal-700"
//                       : "text-gray-600 hover:text-teal-700"
//                   }`}>
//                   Khám phá
//                   <span className="text-xs">▾</span>
//                 </button>
//               </Dropdown>

//               {/* Hồ sơ Dropdown */}
//               <Dropdown
//                 menu={{ items: profileNavMenuItems }}
//                 trigger={["click"]}>
//                 <button
//                   className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
//                     isActive("/patient")
//                       ? "text-teal-700"
//                       : "text-gray-600 hover:text-teal-700"
//                   }`}>
//                   Hồ sơ
//                   <span className="text-xs">▾</span>
//                 </button>
//               </Dropdown>

//               <Link
//                 to="/booking"
//                 className={`text-sm font-medium transition-colors ${
//                   isActive("/booking")
//                     ? "text-teal-700"
//                     : "text-gray-600 hover:text-teal-700"
//                 }`}>
//                 Đặt khám
//               </Link>
//             </nav>

//             {/* Right Actions */}
//             <div className="flex items-center gap-4">
//               {/* Avatar with Dropdown */}
//               <Dropdown
//                 menu={{ items: profileMenuItems }}
//                 trigger={["click"]}
//                 placement="bottomRight">
//                 <Avatar
//                   size={40}
//                   src={avatarUrl || undefined}
//                   className="bg-teal-600 cursor-pointer hover:opacity-80 transition-opacity">
//                   {!avatarUrl ? getAvatarFallback() : null}
//                 </Avatar>
//               </Dropdown>

//               {/* Mobile Menu Button */}
//               <button className="md:hidden text-gray-600">
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 w-full">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-100 text-black">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* Footer Content Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             {/* Company Info */}
//             <div>
//               <h3 className="text-black font-bold text-lg mb-4">
//                 CÔNG TY TNHH HEALTHCARE VIỆT NAM
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <p>
//                   <strong>VPĐD:</strong> 3/1 Thành Thái, Phường Diên Hồng, TP.
//                   HCM
//                 </p>
//                 <p>
//                   <strong>Hotline:</strong> 1900-2805 (8:00 - 17:30 từ T2 đến
//                   T7)
//                 </p>
//                 <p>
//                   <strong>Số ĐKKD:</strong> 0315268642
//                 </p>
//               </div>
//             </div>

//             {/* Về Healthcare */}
//             <div>
//               <h3 className="text-black font-bold mb-4">Về Healthcare</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Giới thiệu về Healthcare
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Ban điều hành
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Nhân sự & Tuyển dụng
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Liên hệ
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Dịch vụ */}
//             <div>
//               <h3 className="text-black font-bold mb-4">Dịch vụ</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Đặt khám Bác sĩ
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Đặt khám Bệnh viện
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Đặt khám Phòng khám
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Y360
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Hỗ trợ */}
//             <div>
//               <h3 className="text-black font-bold mb-4">Hỗ trợ</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Điều khoản sử dụng
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Chính sách bảo mật
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     Chính sách giải quyết khiếu nại
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="mailto:cskh@healthcare.vn"
//                     className="text-black hover:text-gray-700 transition-colors">
//                     cskh@healthcare.vn
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Social Links */}
//           {/* <div className="border-t border-gray-300 pt-8 mb-8">
//             <p className="text-sm mb-4 text-black">Kết nối với chúng tôi</p>
//             <div className="flex gap-4">
//               <a href="#" className="text-black hover:text-gray-700 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-black hover:text-gray-700 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-3 1"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-black hover:text-gray-700 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-black hover:text-gray-700 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M18.485 0h3.556L11.39 9.881v6.748H7.957V9.88C4.278 4.146 0 0 0 0h3.556s5.67 6.328 7.4 8.547c1.73-2.22 7.4-8.547 7.4-8.547z"/>
//                 </svg>
//               </a>
//             </div>
//           </div> */}

//           {/* Bottom Text */}
//           <div className="border-t border-gray-300 pt-8 text-center text-sm text-black">
//             <p className="mb-4">
//               Các thông tin trên Healthcare chỉ dành cho mục đích tham khảo, tra
//               cứu và không thay thế cho việc chẩn đoán hoặc điều trị y khoa.
//             </p>
//             <p className="mb-4">
//               Cần tuyết đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.
//             </p>
//             <p>Copyright © 2018 - 2026 Công ty TNHH YouMed Việt Nam.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }