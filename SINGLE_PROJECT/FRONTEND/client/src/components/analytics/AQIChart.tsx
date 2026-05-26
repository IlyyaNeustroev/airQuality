
import { Card } from "antd";
import { fetchAnalyticsData } from "../../api";

// SVG-точки и отрезки по данным
export default async function AQIChart() {
  try {
    const data = await fetchAnalyticsData();

    const points = data.weekly_aqi;

    // Генерация точек и линии SVG
    const polylinePoints = points.map((p, i) => {
      const x = i * 60;
      const y = 120 - p;
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

          <svg className="line-svg">
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
  } catch (error) {
    console.error("Ошибка загрузки AQI-графика:", error);
    return <Card className="neon-card">Загрузка графика...</Card>;
  }
}