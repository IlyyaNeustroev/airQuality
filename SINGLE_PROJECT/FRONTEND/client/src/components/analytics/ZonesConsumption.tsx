// src/components/analytics/ZonesConsumption.tsx
import { Card } from "antd";
import ZoneProgress from "./ZoneProgress";
import { useEffect, useState } from "react";
import { fetchAnalyticsData } from "../../api";

// тип для данных зон
interface Zone {
  label: string;
  percent: number;
}

interface AnalyticsData {
  zones: Zone[];
}

export default function ZonesConsumption() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAnalyticsData();
        setData(result);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Неизвестная ошибка загрузки";
        setError(message);
        console.error("Ошибка загрузки потребления по зонам:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card
        className="neon-card"
        title={
          <span style={{ color: "#00eaff" }}>
            Потребление по зонам
          </span>
        }
      >
        <div style={{ color: "#00eaff", padding: "12px 0" }}>
          Загрузка данных по зонам...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className="neon-card"
        title={
          <span style={{ color: "#00eaff" }}>
            Потребление по зонам
          </span>
        }
      >
        <div style={{ color: "red" }}>Ошибка: {error}</div>
      </Card>
    );
  }

  const zones = data?.zones || [
    { label: "Серверная", percent: 32 },
    { label: "Открытый офис", percent: 28 },
    { label: "Конференц-зал", percent: 18 },
    { label: "Лаборатория", percent: 12 },
    { label: "Остальные", percent: 10 },
  ];

  return (
    <Card
      className="neon-card"
      title={
        <span style={{ color: "#00eaff" }}>
          Потребление по зонам
        </span>
      }
    >
      {zones.map((z, i) => (
        <ZoneProgress
          key={z.label} // лучше использовать label, чем индекс
          label={z.label}
          percent={z.percent}
          color={[
            "#00eaff",
            "#00ffaa",
            "#ffaa00",
            "#2f6bff",
            "#1d7a85",
          ][i % 5]}
        />
      ))}
    </Card>
  );
}