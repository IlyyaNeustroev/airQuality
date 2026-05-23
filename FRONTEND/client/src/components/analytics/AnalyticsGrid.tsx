import { Row, Col } from "antd";
import AnalyticsStats from "./AnalyticsStats";
import ConsumptionChart from "./ConsumptionChart";
import AQIChart from "./AQIChart";
import ZonesConsumption from "./ZonesConsumption";

const AnalyticsGrid = () => {
  return (
    <>
      <AnalyticsStats />

      <div style={{ marginTop: 16 }}>
        <ConsumptionChart />
      </div>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <AQIChart />
        </Col>

        <Col span={12}>
          <ZonesConsumption />
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsGrid;
