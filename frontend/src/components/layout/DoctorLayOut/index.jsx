import { useMemo, useState } from "react";
import { Layout } from "antd";
import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";
import DoctorFooter from "./DoctorFooter";

const HEADER_HEIGHT = 64;
const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 84;

const DEFAULT_MENU = [
  { key: "thong-tin", label: "Thông tin bác sĩ" },
  { key: "quan-ly-benh-nhan", label: "Quản lý bệnh nhân" },
];

export default function DoctorLayout({
  activeKey,
  onMenuChange,
  menuItems = DEFAULT_MENU,
  doctorName = "Bác sĩ",
  children,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const contentOffset = useMemo(() => {
    return sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-slate-50">
      <DoctorHeader doctorName={doctorName} />

      <DoctorSidebar
        activeKey={activeKey}
        onMenuChange={onMenuChange}
        menuItems={menuItems}
        doctorName={doctorName}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        headerHeight={HEADER_HEIGHT}
      />

      <Layout
        style={{
          marginLeft: contentOffset,
          marginTop: HEADER_HEIGHT,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Layout.Content className="p-4 md:p-6">{children}</Layout.Content>
        <DoctorFooter />
      </Layout>

    </div>
  );
}
