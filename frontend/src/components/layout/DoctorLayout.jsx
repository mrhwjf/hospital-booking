import React, { useMemo, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Typography, Button, Space, Drawer, Grid } from "antd";
import {
	MedicineBoxOutlined,
	UserOutlined,
	SettingOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	DownOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const menuConfig = [
	{
		key: "appointments",
		label: "Khám bệnh",
		icon: <MedicineBoxOutlined />,
		path: "/doctor/appointments",
	},
	{
		key: "profile",
		label: "Thông tin cá nhân",
		icon: <UserOutlined />,
		path: "/doctor/profile",
	},
	{
		key: "account",
		label: "Thông tin tài khoản",
		icon: <SettingOutlined />,
		path: "/doctor/account",
	},
	{
		key: "logout",
		label: "Đăng xuất",
		icon: <LogoutOutlined />,
		path: "/logout",
	},
];

const DoctorLayout = ({
	children,
	doctorName = "Bác sĩ",
	avatarUrl = "https://ui-avatars.com/api/?name=Bac+Si&background=0F766E&color=fff",
	onLogout,
}) => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const screens = Grid.useBreakpoint();
	const isMobile = !screens.md;
	const isTablet = screens.md && !screens.lg;
	const contentPadding = isMobile ? "16px" : "24px 32px";

	const activeKey = useMemo(() => {
		const match = menuConfig.find((item) => location.pathname.startsWith(item.path));
		return match?.key ?? "appointments";
	}, [location.pathname]);

	const handleMenuSelect = ({ key }) => {
		setMobileMenuOpen(false);
		if (key === "logout") {
			if (typeof onLogout === "function") {
				onLogout();
				return;
			}
			navigate("/logout");
			return;
		}

		const target = menuConfig.find((item) => item.key === key);
		if (target?.path) {
			navigate(target.path);
		}
	};

	const dropdownMenu = {
		items: [
			{
				key: "profile",
				label: "Thông tin cá nhân",
				icon: <UserOutlined />,
			},
			{
				key: "account",
				label: "Thông tin tài khoản",
				icon: <SettingOutlined />,
			},
			{
				type: "divider",
			},
			{
				key: "logout",
				label: "Đăng xuất",
				icon: <LogoutOutlined />,
				danger: true,
			},
		],
		onClick: ({ key }) => handleMenuSelect({ key }),
	};

	const contentNode = children ?? <Outlet />;

	return (
		<Layout className="min-h-screen">
			{!isMobile && (
				<Sider
					collapsible
					trigger={null}
					collapsed={collapsed}
					width={240}
					collapsedWidth={isTablet ? 72 : 80}
					style={{
						background: "#0F172A",
						position: "sticky",
						top: 0,
						height: "100vh",
						overflow: "hidden",
					}}
				>
					<div className="flex h-full flex-col">
						<div className="flex items-center gap-3 border-b border-slate-700 px-2 py-2">
							<img src="/logo.png" alt="Hospital Booking" className="h-10 w-10 rounded-lg object-contain" />
							{!collapsed && (
								<div>
									<Typography.Title level={5} style={{ color: "#F8FAFC", margin: 0 }}>
										Hospital Booking
									</Typography.Title>
									<Typography.Text style={{ color: "#94A3B8" }}>
										Không gian bác sĩ
									</Typography.Text>
								</div>
							)}
						</div>

						<Menu
							style={{ flex: 1, overflow: "auto" }}
							theme="dark"
							mode="inline"
							selectedKeys={[activeKey]}
							onClick={handleMenuSelect}
							items={menuConfig.map((item) => ({
								key: item.key,
								icon: item.icon,
								label: item.label,
							}))}
						/>
					</div>
				</Sider>
			)}

			<Layout>
				<Header
					style={{
						background: "#F8FAFC",
						borderBottom: "1px solid #E2E8F0",
						padding: isMobile ? "0 16px" : "0 24px",
						position: "sticky",
						top: 0,
						zIndex: 11,
					}}
				>
					<div className="flex h-full flex-wrap items-center justify-between gap-3">
						<Button
							type="text"
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() =>
								isMobile ? setMobileMenuOpen(true) : setCollapsed((prev) => !prev)
							}
							style={{ fontSize: 18 }}
						/>

						<Space size={12} wrap className="justify-end">
							<div className="flex flex-col text-right">
								<Typography.Text className="text-xs text-slate-500">
									Xin chào
								</Typography.Text>
								<Typography.Text className="font-semibold text-slate-900">
									{doctorName}
								</Typography.Text>
							</div>
							<Dropdown menu={dropdownMenu} placement="bottomRight" trigger={["click"]}>
								<Space className="cursor-pointer">
									<Avatar src={avatarUrl} size={40} />
									<DownOutlined className="text-teal-700" />
								</Space>
							</Dropdown>
						</Space>
					</div>
				</Header>

				<Content
					style={{
						background: "#F1F5F9",
						padding: contentPadding,
						minHeight: "calc(100vh - 64px)",
					}}
				>
					<div className="min-h-[70vh] rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
						{contentNode}
					</div>
				</Content>

				<Drawer
                
					placement="left"
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					bodyStyle={{ padding: 0 }}
					width={240}
				>
					<div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 ">
						<img src="/logo.png" alt="Hospital Booking" className="h-10 w-10 rounded-lg object-contain" />
						<div>
							<Typography.Title level={5} style={{ margin: 0 }}>
								Hospital Booking
							</Typography.Title>
							<Typography.Text type="secondary">Không gian bác sĩ</Typography.Text>
						</div>
					</div>
					<Menu
						mode="inline"
						selectedKeys={[activeKey]}
						onClick={handleMenuSelect}
						items={menuConfig.map((item) => ({
							key: item.key,
							icon: item.icon,
							label: item.label,
						}))}
					/>
				</Drawer>
			</Layout>
		</Layout>
	);
};

export default DoctorLayout;
