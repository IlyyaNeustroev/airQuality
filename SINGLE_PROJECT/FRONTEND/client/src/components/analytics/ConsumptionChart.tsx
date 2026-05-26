// src/components/analytics/ConsumptionChart.tsx
import { Card } from "antd";
import { useEffect, useState } from "react";
import { fetchAnalyticsData } from "../../api";

// тип для данных почасового потребления
interface AnalyticsData {
  hourly_consumption: number[]; // 24 значения [0..100], %
}

export default function ConsumptionChart() {
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
        console.error("Ошибка загрузки графика потребления:", err);
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
            Потребление по часам — сегодня
          </span>
        }
      >
        <div style={{ color: "#00eaff", padding: "12px 0" }}>
          Загрузка графика потребления...
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
            Потребление по часам — сегодня
          </span>
        }
      >
        <div style={{ color: "red" }}>Ошибка: {error}</div>
      </Card>
    );
  }

  const bars = data?.hourly_consumption || Array(24).fill(50); // fallback

  return (
    <Card
      className="neon-card"
      title={
        <span style={{ color: "#00eaff" }}>
          Потребление по часам — сегодня
        </span>
      }
    >
      <div className="bars-chart">
        {bars.map((height, index) => (
          <div
            key={index}
            className="chart-bar"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Card>
  );
}