import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
	BarsOutlined,
	LogoutOutlined,
	MedicineBoxOutlined,
	MenuOutlined,
	TeamOutlined,
	UserOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Grid, Layout, Menu, Space, Typography } from 'antd'
import { getMe } from '../../api/authApi'
import { MENU_CONFIG } from '../../app/menuConfig'
import {
	clearStoredAuthState,
	getStoredAuthToken,
	getStoredUserAvatar,
	getStoredUserName,
	hasStoredAllPermissions,
	setStoredPermissions,
	setStoredUserProfile,
	subscribeUserProfileUpdates,
} from '../../utils/userProfileSync'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const DOCTOR_MENU = MENU_CONFIG.DOCTOR

const iconMap = {
	user: <UserOutlined />,
	team: <TeamOutlined />,
	setting: <SettingOutlined />,
	logout: <LogoutOutlined />,
}

const getSelectedRoute = (pathname, items) => {
	const matched = items.find((item) => pathname.startsWith(item.route))
	return matched?.route || items[0]?.route
}

const getAvatarFallback = (name) => {
	const trimmedName = String(name || '').trim()

	if (!trimmedName) {
		return <UserOutlined />
	}

	return trimmedName.charAt(0).toUpperCase()
}

export default function DoctorLayout({ doctorName, children }) {
	const screens = useBreakpoint()
	const location = useLocation()
	const navigate = useNavigate()
	const [collapsed, setCollapsed] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [profileSnapshot, setProfileSnapshot] = useState(() => ({
		userName: getStoredUserName(),
		avatarUrl: getStoredUserAvatar(),
	}))

	const doctorMenu = useMemo(
		() => DOCTOR_MENU.filter((item) => hasStoredAllPermissions(item.permissions || [])),
		[],
	)

	const isMobile = screens.md
	const selectedRoute = getSelectedRoute(location.pathname, doctorMenu)
	const resolvedDoctorName = doctorName || profileSnapshot.userName || 'Tài khoản'
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
					setStoredPermissions(me?.permissions || [])
				})
				.catch(() => {
					// Keep layout responsive even if profile bootstrap fails.
				})
		}

		return unsubscribe
	}, [])

	const mainMenuItems = useMemo(
		() =>
			doctorMenu.filter((item) => item.icon !== 'logout').map((item) => ({
				key: item.route,
				icon: iconMap[item.icon] || <BarsOutlined />,
				label: item.label,
			})),
		[doctorMenu],
	)

	const logoutItem = useMemo(() => {
		const item = doctorMenu.find((menuItem) => menuItem.icon === 'logout')
		if (!item) {
			return null
		}

		return {
			key: item.route,
			icon: <LogoutOutlined />,
			label: item.label,
			className: 'text-red-500! hover:bg-red-50!',
		}
	}, [doctorMenu])

	const handleMenuClick = ({ key }) => {
		if (key === '/doctor/logout') {
			clearStoredAuthState()
			navigate('/', { replace: true })
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
				className="hb-sidebar-menu flex-1 border-0"
			/>

			{logoutItem ? (
				<div className="border-t border-slate-200 p-2">
					<Menu
						mode="inline"
						selectedKeys={selectedRoute ? [selectedRoute] : []}
						onClick={handleMenuClick}
						items={[logoutItem]}
						className="hb-sidebar-menu border-0"
					/>
				</div>
			) : null}
		</div>
	)

	return (
		<Layout className="h-screen overflow-hidden bg-slate-50 sticky top-0">
			<Header className="z-20 flex h-16 items-center justify-between border-b-4 border-slate-200! bg-white! px-4! md:px-6!">
				<Space size={12} align="center">
					{!isMobile ? (
						<Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />
					) : null}
					<div className="flex items-center gap-2">
						<MedicineBoxOutlined className="text-2xl text-teal-700" />
						<div className="flex flex-col sm:flex-row sm:items-center">
							<Title level={4} className="mb-0! text-teal-700!">
								Hospital Booking
							</Title>
							<div className="my-1 h-0.5 w-full bg-slate-300 sm:mx-2 sm:my-0 sm:h-6 sm:w-0.5" />
							<Text type="secondary">Khu vực bác sĩ</Text>
						</div>
					</div>
				</Space>

				<Space size={8} align="center">
					<Avatar size="large" src={resolvedAvatarUrl} className="bg-teal-700">
						{!resolvedAvatarUrl ? getAvatarFallback(resolvedDoctorName) : null}
					</Avatar>
					{/* <Text className="hidden md:inline">{resolvedDoctorName}</Text> */}
				</Space>
			</Header>

			<Layout className="h-[calc(100vh-64px)] overflow-hidden">
				{isMobile ? (
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

				<Content className="h-full overflow-y-auto bg-slate-50 p-4 md:p-6">
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
