import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  LineChartOutlined,
  HistoryOutlined,
  ControlOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Sider width={220} style={{ background: "#041018" }}>
      <div style={{ color: "#00eaff", padding: 16, fontWeight: 700 }}>
        AERO CONTROL
      </div>

      <Menu
        theme="dark"
        mode="inline"
        onClick={({ key }) => navigate(key)}
        items={[
          { key: "/", icon: <DashboardOutlined />, label: "Главная" },
          {
            key: "/monitoring",
            icon: <LineChartOutlined />,
            label: "Мониторинг",
          },
          { key: "/history", icon: <HistoryOutlined />, label: "История" },
          { key: "/control", icon: <ControlOutlined />, label: "Управление" },
          { key: "/analytics", icon: <BarChartOutlined />, label: "Аналитика" },
          { key: "/settings", icon: <SettingOutlined />, label: "Настройки" },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
