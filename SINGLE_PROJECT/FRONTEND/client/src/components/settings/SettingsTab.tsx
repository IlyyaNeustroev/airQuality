import { Tabs } from "antd";
import SettingsSection from "./SettingsSection";
import { fetchSettings, updateSettings } from "../../api";
import { useEffect, useState } from "react";

const SettingsTabs = () => {
  const [settings, setSettings] = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки настроек:", error);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      const res = await updateSettings(settings.settings);
      setSettings(res);
      alert("Настройки сохранены!");
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
      alert("Не удалось сохранить настройки");
    }
  };

  if (loading) return <Tabs>Загрузка настроек...</Tabs>;

  // Сигнализируем, что вкладка ML — с настройками, вкладка SYSTEM — с system_settings, notifications — с notifications_settings
  return (
    <Tabs
      defaultActiveKey="ml"
      tabBarExtraContent={
        <button onClick={handleSave} style={{ color: "white", background: "blue", border: "none", padding: "6px 12px" }}>
          Сохранить
        </button>
      }
      items={[
        {
          key: "ml",
          label: <span style={{ color: "white" }}>ML-Модель</span>,
          children: <SettingsSection
            mlSettings={settings.settings.ml}
            modelInfo={settings.model_info}
            onChange={(ml) => setSettings(prev => prev ? { ...prev, settings: { ...prev.settings, ml } } : null)}
          />,
        },
        {
          key: "system",
          label: <span style={{ color: "white" }}>Система</span>,
          children: <div style={{ color: "white" }}>
            <p>Системные настройки</p>
            <pre>{JSON.stringify(settings.settings.system, null, 2)}</pre>
          </div>,
        },
        {
          key: "notifications",
          label: <span style={{ color: "white" }}>Уведомления</span>,
          children: <div style={{ color: "white" }}>
            <p>Настройки уведомлений</p>
            <pre>{JSON.stringify(settings.settings.notifications, null, 2)}</pre>
          </div>,
        },
      ]}
    />
  );
};

export default SettingsTabs;