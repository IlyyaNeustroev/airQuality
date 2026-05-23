import { Card } from "antd";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const AnalyticsStatCard = ({ title, value, subtitle, color }: Props) => {
  return (
    <Card className="neon-card analytics-stat-card">
      <div
        style={{
          color: "#00eaff",
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#4dd0e1",
          marginTop: 8,
          fontSize: 12,
        }}
      >
        {subtitle}
      </div>
    </Card>
  );
};

export default AnalyticsStatCard;
