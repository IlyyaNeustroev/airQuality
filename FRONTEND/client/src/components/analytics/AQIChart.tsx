import { Card } from "antd";

const points = [30, 50, 70, 35, 90, 110, 85];

const AQIChart = () => {
  return (
    <Card
      className="neon-card"
      title={<span style={{ color: "#00eaff" }}>Средний AQI — неделя</span>}
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
            points="
              0,120
              60,90
              120,70
              180,120
              240,40
              300,20
              360,50
            "
          />
        </svg>
      </div>
    </Card>
  );
};

export default AQIChart;
