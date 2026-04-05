import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Menu, Space, Tag, Typography, message } from 'antd'
import { getMe } from '../../api/authApi'
import { MENU_CONFIG } from '../../app/menuConfig'
import {
  clearStoredAuthState,
  getStoredAuthToken,
  getStoredUserAvatar,
  getStoredUserName,
  setStoredUserProfile,
  subscribeUserProfileUpdates,
} from '../../utils/userProfileSync'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const PATIENT_MENU_ITEMS = MENU_CONFIG.PATIENT

const patientIconMap = {
  dashboard: <DashboardOutlined />,
  compass: <SearchOutlined />,
  medicine: <AppstoreOutlined />,
  calendar: <CalendarOutlined />,
  schedule: <ScheduleOutlined />,
  file: <FileTextOutlined />,
  user: <UserOutlined />,
  setting: <SettingOutlined />,
  logout: <LogoutOutlined />,
}

const getSelectedRoute = (pathname) => {
  if (pathname.startsWith('/patient/kham-pha/doctors/')) {
    return '/patient/kham-pha/explore'
  }

  const matched = PATIENT_MENU_ITEMS
    .filter((item) => item.icon !== 'logout')
    .find((item) => pathname === item.route || pathname.startsWith(`${item.route}/`))

  return matched?.route || '/patient/dashboard'
}

const getAvatarFallback = (name) => {
  const trimmedName = String(name || '').trim()

  if (!trimmedName) {
    return <UserOutlined />
  }

  return trimmedName.charAt(0).toUpperCase()
}

export default function PatientLayout({ patientName, children }) {
  const screens = useBreakpoint()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [profileSnapshot, setProfileSnapshot] = useState(() => ({
    userName: getStoredUserName(),
    avatarUrl: getStoredUserAvatar(),
  }))

  const isMobile = !screens.lg
  const selectedRoute = getSelectedRoute(location.pathname)
  const resolvedPatientName = patientName || profileSnapshot.userName || 'Tài khoản'
  const resolvedAvatarUrl = profileSnapshot.avatarUrl || undefined

  useEffect(() => {
    const syncProfileSnapshot = () => {
      setProfileSnapshot({
        userName: getStoredUserName(),
        avatarUrl: getStoredUserAvatar(),
      })
    }

    syncProfileSnapshot()

    const unsubscribe = subscribeUserProfileUpdates(syncProfileSnapshot)

    const token = getStoredAuthToken()
    if (token && (!getStoredUserName() || !getStoredUserAvatar())) {
      getMe()
        .then((me) => {
          setStoredUserProfile({
            userName: me?.ho_ten,
            avatarUrl: me?.hinh_anh,
          })
        })
        .catch(() => {
          // Keep layout responsive even if profile bootstrap fails.
        })
    }

    return unsubscribe
  }, [])

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
    clearStoredAuthState()
    message.success('Đã đăng xuất khỏi khu vực bệnh nhân.')
    navigate('/login', { replace: true })
  }

  const handleMenuClick = ({ key }) => {
    if (key === '/patient/logout') {
      handleLogout()
      return
    }

    navigate(key)
    setDrawerOpen(false)
  }

  const profileMenuItems = [
    {
      key: '/patient/profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ bệnh nhân',
    },
    {
      key: '/patient/account',
      icon: <SettingOutlined />,
      label: 'Thông tin tài khoản',
    },
    {
      type: 'divider',
    },
    {
      key: '/patient/logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ]

  const handleProfileMenuClick = ({ key }) => {
    if (key === '/patient/logout') {
      handleLogout()
      return
    }

    navigate(key)
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
            <Button type="text" icon={<MenuOutlined style={{ color: '#0F172A' }} />} onClick={() => setDrawerOpen(true)} />
          ) : null}
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-2xl text-[#0F766E]" />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Title level={4} className="mb-0! text-[#0F766E]!">
                Hospital Booking
              </Title>
              <div className="my-1 hidden h-0.5 w-full bg-gray-300 sm:mx-2 sm:my-0 sm:block sm:h-6 sm:w-0.5" />
              <Text type="secondary" className="hidden sm:inline">Cổng Bệnh Nhân</Text>
            </div>
          </div>
        </Space>

        <Space size={10} align="center">
          <Tag color="cyan" style={{ borderRadius: 999, margin: 0 }} className="hidden md:inline-flex">
            Vai trò: BỆNH NHÂN
          </Tag>
          <Dropdown
            menu={{
              items: profileMenuItems,
              onClick: handleProfileMenuClick,
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <button type="button" className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100">
              <Avatar
                src={resolvedAvatarUrl}
                style={{ background: '#ffffff', color: '#0F766E' }}
              >
                {!resolvedAvatarUrl ? getAvatarFallback(resolvedPatientName) : null}
              </Avatar>
              <Text style={{ color: '#0F172A' }} className="hidden md:inline">{resolvedPatientName}</Text>
            </button>
          </Dropdown>
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
}
