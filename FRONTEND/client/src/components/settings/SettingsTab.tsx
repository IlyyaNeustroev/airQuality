import { Tabs } from "antd";
import SettingsSection from "./SettingsSection";

const SettingsTabs = () => {
  return (
    <Tabs
      defaultActiveKey="ml"
      items={[
        {
          key: "ml",
          label: <span style={{ color: "white" }}>ML-Модель</span>,
          children: <SettingsSection />,
        },
        {
          key: "system",
          label: <span style={{ color: "white" }}>Система</span>,
          children: <div style={{ color: "white" }}>Системные настройки</div>,
        },
        {
          key: "notifications",
          label: <span style={{ color: "white" }}>Уведомления</span>,
          children: <div style={{ color: "white" }}>Настройки уведомлений</div>,
        },
      ]}
    />
  );
};

export default SettingsTabs;
