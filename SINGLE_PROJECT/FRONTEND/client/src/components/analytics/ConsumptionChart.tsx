import { Card } from "antd";

const bars = [20, 40, 60, 80, 52, 70, 88, 92, 65, 58, 74, 50];

const ConsumptionChart = () => {
  return (
    <Card
      className="neon-card"
      title={
        <span style={{ color: "#00eaff" }}>Потребление по часам — сегодня</span>
      }
    >
      <div className="bars-chart">
        {bars.map((height, index) => (
          <div
            key={index}
            className="chart-bar"
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>
    </Card>
  );
};

export default ConsumptionChart;
