import { Card, Progress } from "antd";

interface Props {
  title: string;
  value: string;
  percent?: number;
  color?: string;
}

const MetricCard: React.FC<Props> = ({ title, value, percent, color }) => {
  return (
    <Card size="small" style={{ background: "#081c2a", color: "#00eaff" }}>
      <div style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
      {percent !== undefined && (
        <Progress percent={percent} showInfo={false} strokeColor={color} />
      )}
    </Card>
  );
};

export default MetricCard;
