// src/components/analytics/ZonesConsumption.tsx
import { Card } from "antd";
import ZoneProgress from "./ZoneProgress";
import { fetchAnalyticsData } from "../../api";

export default async function ZonesConsumption() {
  try {
    const data = await fetchAnalyticsData();

    return (
      <Card
        className="neon-card"
        title={
          <span style={{ color: "#00eaff" }}>
            Потребление по зонам
          </span>
        }
      >
        {data.zones.map((z, i) => (
          <ZoneProgress
            key={i}
            label={z.label}
            percent={z.percent}
            color={[
              "#00eaff", "#00ffaa",
              "#ffaa00", "#2f6bff", "#1d7a85"
            ][i % 5]}
          />
        ))}
      </Card>
    );
  } catch (error) {
    console.error("Ошибка загрузки потребления по зонам:", error);
    return <Card className="neon-card">Загрузка...</Card>;
  }
}