import { Button, Divider, Layout, Menu } from "antd";
import {
  BarsOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

function getMenuIcon(key) {
  if (key === "thong-tin") {
    return <UserOutlined />;
  }

  if (key === "quan-ly-benh-nhan") {
    return <CalendarOutlined />;
  }

  return <BarsOutlined />;
}

export default function DoctorSidebar({
  activeKey,
  onMenuChange,
  menuItems = [],
  doctorName = "Bác sĩ",
  collapsed = false,
  onCollapsedChange,
  width = 240,
  collapsedWidth = 84,
  headerHeight = 64,
}) {
  const menuData = menuItems.map((item) => ({
    key: item.key,
    icon: getMenuIcon(item.key),
    label: item.label,
  }));

  return (
    <Layout.Sider
      theme="light"
      collapsible
      trigger={null}
      width={width}
      collapsedWidth={collapsedWidth}
      collapsed={collapsed}
      style={{
        position: "fixed",
        left: 0,
        top: headerHeight,
        bottom: 0,
        borderRight: "1px solid #E2E8F0",
        background: "#FFFFFF",
        overflow: "auto",
      }}
    >
      <div className="flex h-full flex-col p-3">
        <Button
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="mb-3"
        >
          {!collapsed ? "Thu gọn" : null}
        </Button>

        {!collapsed && <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Quản lý khám bệnh</div>}

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuData}
          onClick={({ key }) => onMenuChange?.(key)}
          style={{ border: "none" }}
        />

        <div className="mt-auto">
          <Divider className="!my-3" />
          {!collapsed && <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tài khoản</div>}

          <div className="space-y-2">
            <Button block icon={<UserOutlined />} className="!text-left">
              {!collapsed ? `Thông tin tài khoản` : null}
            </Button>

            <Button danger block icon={<LogoutOutlined />} className="!text-left">
              {!collapsed ? `Đăng xuất` : null}
            </Button>
          </div>

          {!collapsed && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {doctorName}
            </div>
          )}
        </div>
      </div>
    </Layout.Sider>
  );
}
