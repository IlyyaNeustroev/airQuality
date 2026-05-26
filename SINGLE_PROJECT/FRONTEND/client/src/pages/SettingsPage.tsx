import { Card, Button } from "antd";
import SettingsTabs from "../components/settings/SettingsTab";

const SettingsPage = () => {
  return (
    <Card
      className="custom-card"
      title={<span style={{ color: "#00eaff" }}>Настройки системы</span>}
      extra={
        <Button
          type="primary"
          onClick={() => {
            // кнопка "Сохранить" дергается из SettingsTabs
          }}
        >
          Сохранить
        </Button>
      }
    >
      <SettingsTabs />
    </Card>
  );
};

export default SettingsPage;