import { Card } from "antd";
import { fetchAnalyticsData } from "../../api";

export default async function ConsumptionChart() {
  try {
    const data = await fetchAnalyticsData();

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
          {data.hourly_consumption.map((height, index) => (
            <div
              key={index}
              className="chart-bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </Card>
    );
  } catch (error) {
    console.error("Ошибка загрузки графика потребления:", error);
    return <Card className="neon-card">Загрузка графика...</Card>;
  }
}