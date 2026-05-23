import { Card, Slider, Button, Space } from "antd";

const ZoneSettings = () => {
  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Настройка</span>}
      className="custom-card"
    >
      <div>
        <div style={{ marginBottom: 16, color: "white" }}>Режим</div>
        <Space style={{ marginBottom: 12 }}>
          <Button>Авто</Button>
          <Button type="primary">Вкл</Button>
          <Button>Выкл</Button>
        </Space>
      </div>

      <div>
        <div style={{ color: "white" }}>Скорость вентилятора</div>
        <Slider defaultValue={80} />
      </div>

      <div style={{ marginTop: 16, color: "white" }}>
        <div>Целевая температура</div>
        <Slider defaultValue={22} min={16} max={30} />
      </div>

      <div style={{ marginTop: 16, color: "white" }}>
        <div>Клапан</div>
        <Slider defaultValue={100} />
      </div>
    </Card>
  );
};

export default ZoneSettings;
