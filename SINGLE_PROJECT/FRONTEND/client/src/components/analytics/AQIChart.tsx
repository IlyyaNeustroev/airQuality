// src/components/analytics/AQIChart.tsx
import { Card } from "antd";
import { useEffect, useState } from "react";
import { fetchAnalyticsData } from "../../api";

// тип данных для AQI за неделю
interface WeeklyData {
  weekly_aqi: number[]; // [7] чисел за 7 дней недели
}

export default function AQIChart() {
  const [data, setData] = useState<WeeklyData | null>(null);
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
        console.error("Ошибка загрузки AQI‑графика:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="neon-card">
        <div style={{ color: "#00eaff", padding: "12px 0" }}>
          Загрузка AQI‑графика...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="neon-card" style={{ color: "red" }}>
        <div>Ошибка: {error}</div>
      </Card>
    );
  }

  const points = data?.weekly_aqi || [60, 65, 70, 68, 75, 80, 78]; // fallback

  const polylinePoints = points.map((p, i) => {
    const x = i * 60;
    const y = 120 - p; // инвертируем, чтобы 0 был внизу
    return `${x},${y}`;
  }).join(" ");

  return (
    <Card
      className="neon-card"
      title={
        <span style={{ color: "#00eaff" }}>
          Средний AQI — неделя
        </span>
      }
    >
      <div className="line-chart">
        {points.map((p, i) => (
          <div
            key={i}
            className="line-point"
            style={{
              left: `${i * 15}%`,
              bottom: `${p}px`,
            }}
          />
        ))}

        <svg
          className="line-svg"
          viewBox="0 0 360 120"
          width="100%"
          height="120px"
        >
          <polyline
            fill="none"
            stroke="#00ffaa"
            strokeWidth="3"
            points={polylinePoints}
          />
        </svg>
      </div>
    </Card>
  );
}