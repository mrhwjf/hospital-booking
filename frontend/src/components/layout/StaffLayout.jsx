import { useMemo, useState } from 'react'
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
import Icon, {
	AppstoreOutlined,
	LaptopOutlined,
	LogoutOutlined,
	MenuOutlined,
	ScheduleOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
	MedicineBoxOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const menuIconByValue = {
	'dat-lich': <ScheduleOutlined />,
	'lich-cua-toi': <AppstoreOutlined />,
	'lich-su-kham': <LaptopOutlined />,
	'ho-so-nhan-vien': <UserOutlined />,
	'le-tan': <TeamOutlined />,
	'admin-lich-bac-si': <SettingOutlined />,
	'logout': <LogoutOutlined />,
}

export default function StaffLayout({
	menuItems = [],
	activeKey,
	onMenuChange,
	staffName = 'Nhân viên mô phỏng',
	children,
}) {
	const screens = useBreakpoint()
	const [drawerOpen, setDrawerOpen] = useState(false)
	const isMobile = !screens.lg
	const [collapsed, setCollapsed] = useState(false)

	const mainMenuItems = useMemo(
		() =>
			menuItems
				.filter((i) => i.value !== 'logout')
				.map((item) => ({
					key: item.value,
					icon: menuIconByValue[item.value] || <AppstoreOutlined />,
					label: item.label,
				})),
		[menuItems],
	)

	const logoutItem = useMemo(() => {
		const item = menuItems.find((i) => i.value === 'logout')
		if (!item) return null
		return {
			key: item.value,
			icon: <LogoutOutlined />,
			label: item.label,
			className: 'text-red-500! hover:bg-red-50!',
		}
	}, [menuItems])

	const handleProfileMenuClick = ({ key }) => {
		if (key === 'profile') {
			onMenuChange?.('ho-so-nhan-vien')
			return
		}
		if (key === 'settings') {
			message.info('Tính năng cài đặt tài khoản sẽ được bổ sung sau.')
			return
		}
		if (key === 'logout') {
			message.info('Đã mô phỏng thao tác đăng xuất.')
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
		onMenuChange?.(key)
		setDrawerOpen(false)
	}

	const navMenu = (
		<div className="flex h-full flex-col">
			<Menu
				mode="inline"
				selectedKeys={activeKey ? [activeKey] : []}
				onClick={handleMenuClick}
				items={mainMenuItems}
				className="flex-1 border-0"
			/>

			{logoutItem && (
				<div className="border-t border-gray-200 p-2">
					<Menu
						mode="inline"
						selectedKeys={activeKey ? [activeKey] : []}
						onClick={handleMenuClick}
						items={[logoutItem]}
						className="border-0"
					/>
				</div>
			)}
		</div>
	)

	return (
		<Layout className="h-screen overflow-hidden bg-[#F8FAFC]">
			<Header className="z-20 flex h-16 items-center justify-between border-b border-[#E2E8F0]! bg-white! px-4! md:px-6!">
				<Space size={12} align="center">
					{isMobile && (
						<Button
							type="text"
							icon={<MenuOutlined />}
							onClick={() => setDrawerOpen(true)}
						/>
					)}
					<div className="flex items-center gap-2">
						<MedicineBoxOutlined className="text-2xl text-[#0F766E]" />
						<div className="flex flex-col sm:flex-row sm:items-center">
							<Title level={4} className="mb-0! text-[#0F766E]!">
								Hospital Booking
							</Title>
							<div className="my-1 h-0.5 w-full bg-gray-300 sm:mx-2 sm:my-0 sm:h-6 sm:w-[2px]" />
							<Text type="secondary">Cổng Nhân Viên</Text>
						</div>
					</div>
				</Space>

				<Dropdown menu={profileMenu} trigger={['hover', 'click']}>
					<div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#F8FAFC]">
						<Avatar size="small" icon={<UserOutlined />} className="bg-[#0F766E]" />
						<Text className="hidden md:inline">{staffName}</Text>
					</div>
				</Dropdown>
			</Header>

			<Layout className="h-[calc(100vh-64px)] overflow-hidden">
				{!isMobile && (
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
				)}

				<Content className="h-full overflow-y-auto bg-[#F8FAFC] p-4 md:p-6">
					{children}
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