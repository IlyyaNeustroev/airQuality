import { Card } from "antd";
import AnalyticsGrid from "../components/analytics/AnalyticsGrid";

const AnalyticsPage = () => {
  return (
    <Card
      className="custom-card"
      title={
        <span style={{ color: "#00eaff" }}>Аналитика и энергопотребление</span>
      }
    >
      <AnalyticsGrid />
    </Card>
  );
};

export default AnalyticsPage;
