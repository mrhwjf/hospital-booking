import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
	AppstoreOutlined,
	LogoutOutlined,
	MedicineBoxOutlined,
	MenuOutlined,
	ScheduleOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons'
import {
	Avatar,
	Button,
	Drawer,
	Dropdown,
	Grid,
	Layout,
	Menu,
	Space,
	Typography,
	message,
} from 'antd'
import { MENU_CONFIG } from '../../app/menuConfig'
import { clearStoredAuthState, getStoredUserAvatar } from '../../utils/userProfileSync'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const STAFF_MENU_ITEMS = MENU_CONFIG.RECEPTIONIST

const iconMap = {
	user: <UserOutlined />,
	setting: <SettingOutlined />,
	schedule: <ScheduleOutlined />,
	logout: <LogoutOutlined />,
}

const getSelectedRoute = (pathname) => {
	const matched = STAFF_MENU_ITEMS.find((item) => pathname.startsWith(item.route))
	return matched?.route || '/staff/appointments'
}

export default function StaffLayout({ staffName = 'Nhân viên mô phỏng', children }) {
	const screens = useBreakpoint()
	const location = useLocation()
	const navigate = useNavigate()
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [collapsed, setCollapsed] = useState(false)

	const isMobile = !screens.lg
	const selectedRoute = getSelectedRoute(location.pathname)

	const mainMenuItems = useMemo(
		() =>
			STAFF_MENU_ITEMS.filter((item) => item.icon !== 'logout').map((item) => ({
				key: item.route,
				icon: iconMap[item.icon] || <AppstoreOutlined />,
				label: item.label,
			})),
		[],
	)

	const logoutItem = useMemo(() => {
		const item = STAFF_MENU_ITEMS.find((menuItem) => menuItem.icon === 'logout')
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
		message.success('Đã đăng xuất khỏi khu vực nhân viên.')
		navigate('/login', { replace: true })
	}

	const handleProfileMenuClick = ({ key }) => {
		if (key === 'profile') {
			navigate('/staff/profile')
			return
		}

		if (key === 'settings') {
			navigate('/staff/account-settings')
			return
		}

		if (key === 'logout') {
			handleLogout()
		}
	}

	const profileMenu = {
		onClick: handleProfileMenuClick,
		items: [
			{ key: 'profile', label: 'Xem hồ sơ nhân viên', icon: <UserOutlined /> },
			{ key: 'settings', label: 'Cài đặt tài khoản', icon: <SettingOutlined /> },
			{ type: 'divider' },
			{ key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, style: { color: 'red' } },
		],
	}

	const handleMenuClick = ({ key }) => {
		if (key === '/staff/logout') {
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
				<div className="border-t border-gray-200 p-2">
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
		<Layout className="h-screen overflow-hidden bg-[#F8FAFC]">
			<Header className="z-20 flex h-16 items-center justify-between border-b-4 border-[#E2E8F0]! bg-white! px-4! md:px-6!">
				<Space size={12} align="center">
					{isMobile ? (
						<Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />
					) : null}
					<div className="flex items-center gap-2">
						<MedicineBoxOutlined className="text-2xl text-[#0F766E]" />
						<div className="flex flex-col sm:flex-row sm:items-center">
							<Title level={4} className="mb-0! text-[#0F766E]!">
								Hospital Booking
							</Title>
							<div className="my-1 h-0.5 w-full bg-gray-300 sm:mx-2 sm:my-0 sm:h-6 sm:w-0.5" />
							<Text type="secondary">Cổng Nhân Viên</Text>
						</div>
					</div>
				</Space>

				<Dropdown menu={profileMenu} trigger={['hover', 'click']}>
					<div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#F8FAFC]">
						<Avatar size="large" src={getStoredUserAvatar()} className="bg-[#0F766E]" />
						<Text className="hidden md:inline">{staffName}</Text>
					</div>
				</Dropdown>
			</Header>

			<Layout className="h-[calc(100vh-64px)] overflow-hidden">
				{!isMobile ? (
					<Sider
						collapsible
						collapsed={collapsed}
						onCollapse={setCollapsed}
						width={250}
						theme="light"
						className="h-full overflow-hidden border-r border-[#E2E8F0] bg-white"
					>
						<div className="h-full py-3">{navMenu}</div>
					</Sider>
				) : null}

				<Content className="h-full overflow-y-auto bg-[#F8FAFC] p-4 md:p-6">
					{children || <Outlet />}
				</Content>
			</Layout>

			<Drawer
				title="Điều hướng"
				placement="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				bodyStyle={{ padding: 0 }}
			>
				{navMenu}
			</Drawer>
		</Layout>
	)
}