// src/components/control/ZoneCard.tsx
import { Card, Progress, Tag } from "antd";

export interface Zone {
  id: string;
  name: string;
  power: number;
  temp: number;
  status: "on" | "off" | "auto";
}

const ZoneCard: React.FC<{ zone: Zone }> = ({ zone }) => {
  const getStatus = (status: Zone["status"]) => {
    switch (status) {
      case "on":
        return <Tag color="green">ВКЛ</Tag>;
      case "off":
        return <Tag>ВЫКЛ</Tag>;
      case "auto":
        return <Tag color="cyan">АВТО</Tag>;
    }
  };

  return (
    <Card size="small" className="custom-card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "white" }}>{zone.name}</div>
        {getStatus(zone.status)}
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 12, color: "white" }}>Мощность</div>
        <Progress percent={zone.power} showInfo={false} strokeColor="#00ffaa" />
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "white" }}>
        {zone.temp}°C
      </div>
    </Card>
  );
};

export default ZoneCard;