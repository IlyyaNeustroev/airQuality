import { Card, Typography } from "antd";
import SettingSwitch from "./SettingSwitch";
import SettingSlider from "./SettingSlider";

const { Title } = Typography;

const ModelSettings = () => {
  return (
    <Card className="neon-card">
      <Title
        level={5}
        style={{
          color: "#00eaff",
          marginBottom: 24,
        }}
      >
        Параметры модели
      </Title>

      <SettingSwitch
        title="ML-предсказания"
        subtitle="Автоматическое управление"
        defaultChecked
      />

      <SettingSwitch
        title="Автопереобучение"
        subtitle="Еженедельно на новых данных"
        defaultChecked
      />

      <SettingSlider
        title="Горизонт прогноза"
        valueLabel="6 ч"
        defaultValue={25}
      />

      <SettingSlider
        title="Интервал обновления"
        valueLabel="15 мин"
        defaultValue={15}
      />

      <SettingSlider
        title='Порог "Хорошо"'
        valueLabel="80"
        defaultValue={80}
        color="#00ffaa"
      />

      <SettingSlider
        title='Порог "Умеренно"'
        valueLabel="60"
        defaultValue={60}
        color="#ffaa00"
      />
    </Card>
  );
};

export default ModelSettings;
