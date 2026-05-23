import { Card } from "antd";
import ZoneProgress from "./ZoneProgress";

const ZonesConsumption = () => {
  return (
    <Card
      className="neon-card"
      title={<span style={{ color: "#00eaff" }}>Потребление по зонам</span>}
    >
      <ZoneProgress label="Серверная" percent={32} color="#00eaff" />

      <ZoneProgress label="Открытый офис" percent={28} color="#00ffaa" />

      <ZoneProgress label="Конференц-зал" percent={18} color="#ffaa00" />

      <ZoneProgress label="Лаборатория" percent={12} color="#2f6bff" />

      <ZoneProgress label="Остальные" percent={10} color="#1d7a85" />
    </Card>
  );
};

export default ZonesConsumption;
