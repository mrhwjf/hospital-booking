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
}
