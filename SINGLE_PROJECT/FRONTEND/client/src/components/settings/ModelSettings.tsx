import { Card, Typography } from "antd";
import SettingSwitch from "./SettingSwitch";
import SettingSlider from "./SettingSlider";

import type{ MlSettings } from "../../api";

const { Title } = Typography;

interface Props {
  mlSettings: MlSettings;
  onChange: (ml: MlSettings) => void;
}

const ModelSettings = ({ mlSettings, onChange }: Props) => {
  const set = (field: keyof MlSettings, value: any) =>
    onChange({ ...mlSettings, [field]: value });

  return (
    <Card className="neon-card">
      <Title
        level={5}
        style={{ color: "#00eaff", marginBottom: 24 }}
      >
        Параметры модели
      </Title>

      <SettingSwitch
        title="ML-предсказания"
        subtitle="Автоматическое управление"
        defaultChecked={mlSettings.enabled}
        onChange={(checked) => set("enabled", checked)}
      />

      <SettingSwitch
        title="Автопереобучение"
        subtitle="Еженедельно на новых данных"
        defaultChecked={mlSettings.auto_retrain}
        onChange={(checked) => set("auto_retrain", checked)}
      />

      <SettingSlider
        title="Горизонт прогноза"
        valueLabel={`${mlSettings.forecast_horizon_hours} ч`}
        defaultValue={mlSettings.forecast_horizon_hours}
        onChange={(v) => set("forecast_horizon_hours", v)}
      />

      <SettingSlider
        title="Интервал обновления"
        valueLabel={`${mlSettings.update_interval_minutes} мин`}
        defaultValue={mlSettings.update_interval_minutes}
        onChange={(v) => set("update_interval_minutes", v)}
      />

      <SettingSlider
        title='Порог "Хорошо"'
        valueLabel={String(mlSettings.threshold_good)}
        defaultValue={mlSettings.threshold_good}
        color="#00ffaa"
        onChange={(v) => set("threshold_good", v)}
      />

      <SettingSlider
        title='Порог "Умеренно"'
        valueLabel={String(mlSettings.threshold_moderate)}
        defaultValue={mlSettings.threshold_moderate}
        color="#ffaa00"
        onChange={(v) => set("threshold_moderate", v)}
      />
    </Card>
  );
};

export default ModelSettings;