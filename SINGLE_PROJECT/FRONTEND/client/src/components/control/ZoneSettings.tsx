// src/components/control/ZoneSettings.tsx
import { Card, Slider, Button, Space } from "antd";
import { updateControlState } from "../../api";

interface Props {
  updateZones: (newZones: any) => void;
}

const ZoneSettings = ({ updateZones }: Props) => {
  const [targetTemp, setTargetTemp] = useState(22);
  const [fanSpeed, setFanSpeed] = useState(80);

  const handleAuto = async () => {
    const data = await updateControlState({ action: "all_auto" });
    updateZones(data.zones);
  };

  const handleOn = async () => {
    const data = await updateControlState({ action: "all_on", target_temp: targetTemp, fan_speed: fanSpeed });
    updateZones(data.zones);
  };

  const handleOff = async () => {
    const data = await updateControlState({ action: "all_off" });
    updateZones(data.zones);
  };

  const handleTempChange = async (val: number) => {
    setTargetTemp(val);
    const data = await updateControlState({ target_temp: val });
    updateZones(data.zones);
  };

  const handleFanChange = async (val: number) => {
    setFanSpeed(val);
    const data = await updateControlState({ fan_speed: val });
    updateZones(data.zones);
  };

  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Настройка</span>}
      className="custom-card"
    >
      <div>
        <div style={{ marginBottom: 16, color: "white" }}>Режим</div>
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={handleAuto}>Авто</Button>
          <Button type="primary" onClick={handleOn}>Вкл</Button>
          <Button onClick={handleOff}>Выкл</Button>
        </Space>
      </div>

      <div>
        <div style={{ color: "white" }}>Скорость вентилятора</div>
        <Slider value={fanSpeed} onChange={handleFanChange} />
      </div>

      <div style={{ marginTop: 16, color: "white" }}>
        <div>Целевая температура</div>
        <Slider value={targetTemp} onChange={handleTempChange} min={16} max={30} />
      </div>

      <div style={{ marginTop: 16, color: "white" }}>
        <div>Клапан</div>
        <Slider defaultValue={100} disabled />  {/* эмуляция, можно сделать управляемым */}
      </div>
    </Card>
  );
};

export default ZoneSettings;