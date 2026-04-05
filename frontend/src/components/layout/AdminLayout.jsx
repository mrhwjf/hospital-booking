import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  Avatar,
  Breadcrumb,
  Button,
  Drawer,
  Layout,
  Menu,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import {
  BarChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { MENU_CONFIG } from '../../app/menuConfig'
import { clearStoredAuthState } from '../../utils/userProfileSync'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const resolveAdminIcon = (iconName) => {
  if (iconName === 'dashboard') return <DashboardOutlined />
  if (iconName === 'team') return <TeamOutlined />
  if (iconName === 'doctor') return <UserSwitchOutlined />
  if (iconName === 'staff') return <UserOutlined />
  if (iconName === 'shield') return <SafetyOutlined />
  if (iconName === 'setting') return <SettingOutlined />
  if (iconName === 'file') return <FileTextOutlined />
  if (iconName === 'chart') return <BarChartOutlined />
  if (iconName === 'schedule') return <CalendarOutlined />
  return <FileTextOutlined />
}

const ADMIN_NAV_CONFIG = MENU_CONFIG.ADMIN

const ADMIN_MENU_ITEMS = ADMIN_NAV_CONFIG.map((item) => ({
  key: item.route,
  icon: resolveAdminIcon(item.icon),
  label: item.label,
}))

const PAGE_TITLES = Object.fromEntries(
  ADMIN_NAV_CONFIG.map((item) => [item.route, item.label]),
)

const getSelectedMenuKey = (pathname) => {
  if (pathname.startsWith('/admin/reports/revenue')) return '/admin/reports/revenue'
  if (pathname.startsWith('/admin/reports/appointments')) return '/admin/reports/appointments'

  const matched = ADMIN_MENU_ITEMS.find((item) => pathname.startsWith(item.key))
  return matched?.key || '/admin/dashboard'
}

const makeBreadcrumbItems = (pathname) => {
  const currentTitle = PAGE_TITLES[getSelectedMenuKey(pathname)] || 'Trang quản trị'

  return [
    { title: 'Admin' },
    { title: currentTitle },
  ]
}

function BrandLogo({ collapsed = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 64,
        paddingInline: collapsed ? 16 : 18,
        borderBottom: '1px solid #E2E8F0',
        background: 'linear-gradient(120deg, #F0FDFA 0%, #EFF6FF 100%)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
          color: '#ffffff',
          background: 'linear-gradient(120deg, #0F766E 0%, #2563EB 100%)',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {!imageFailed ? (
          <img
            src="/hospital.png"
            alt="Hospital"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          'DL'
        )}
      </div>

      {!collapsed ? (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ color: '#0F172A', lineHeight: 1.2, fontSize: 18 }}>
            Đặt lịch khám bệnh
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Bảng điều khiển quản trị
          </Text>
        </Space>
      ) : null}
    </div>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const selectedKey = useMemo(() => getSelectedMenuKey(location.pathname), [location.pathname])
  const pageTitle = PAGE_TITLES[selectedKey] || 'Trang quản trị'
  const breadcrumbItems = useMemo(() => makeBreadcrumbItems(location.pathname), [location.pathname])

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?',
      okText: 'Đăng xuất',
      cancelText: 'Ở lại',
      okButtonProps: { danger: true },
      onOk: () => {
        clearStoredAuthState()
        navigate('/login', { replace: true })
      },
    })
  }

  const onSelectMenu = ({ key }) => {
    navigate(key)
    setMobileOpen(false)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={80}
        collapsed={collapsed}
        width={268}
        trigger={null}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
        className="desktop-admin-sider"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <BrandLogo collapsed={collapsed} />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={ADMIN_MENU_ITEMS}
              onClick={onSelectMenu}
              style={{ borderInlineEnd: 'none', paddingTop: 10 }}
            />
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #E2E8F0' }}>
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ borderRadius: 10 }}
            >
              {!collapsed ? 'Đăng xuất' : null}
            </Button>
          </div>
        </div>
      </Sider>

      <Drawer
        open={mobileOpen}
        placement="left"
        onClose={() => setMobileOpen(false)}
        style={{ width: 292, maxWidth: '100vw' }}
        styles={{ body: { padding: 0 } }}
        title={null}
        className="mobile-admin-drawer"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <BrandLogo collapsed={false} />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={ADMIN_MENU_ITEMS}
              onClick={onSelectMenu}
              style={{ borderInlineEnd: 'none', paddingTop: 10 }}
            />
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #E2E8F0' }}>
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={() => {
                setMobileOpen(false)
                handleLogout()
              }}
              style={{ borderRadius: 10 }}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </Drawer>

      <Layout>
        <Header
          style={{
            background: 'linear-gradient(120deg, #0F766E 0%, #2563EB 100%)',
            paddingInline: 16,
            height: 72,
            lineHeight: 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Space align="center" size={10}>
            {/* <Button
              type="text"
              onClick={() => setMobileOpen(true)}
              icon={<MenuUnfoldOutlined style={{ color: '#ffffff' }} />}
              className="mobile-admin-menu-toggle"
            /> */}

            <Tooltip title={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}>
              <Button
                type="text"
                onClick={() => setCollapsed((prev) => !prev)}
                icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#ffffff' }} /> : <MenuFoldOutlined style={{ color: '#ffffff' }} />}
                className="desktop-admin-collapse-toggle"
              />
            </Tooltip>

            <div>
              <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: 12 }}>Hệ thống đặt lịch khám bệnh</Text>
              <Title level={5} style={{ margin: 0, color: '#ffffff' }}>
                {pageTitle}
              </Title>
            </div>
          </Space>

          <Space size={10}>
            <Tag color="cyan" style={{ marginInlineEnd: 0, borderRadius: 999, paddingInline: 10 }}>
              Vai trò: ADMIN
            </Tag>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#ffffff', color: '#0F766E' }} />
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 18 }}>
          <div style={{ marginBottom: 12 }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
