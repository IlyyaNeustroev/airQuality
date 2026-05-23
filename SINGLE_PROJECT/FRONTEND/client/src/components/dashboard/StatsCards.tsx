import { Row, Col } from "antd";
import MetricCard from "./MetricCard";

const StatsCards = () => {
  return (
    <Row gutter={16}>
      <Col span={4}>
        <MetricCard title="CO2" value="412 ppm" percent={60} color="#00ffcc" />
      </Col>
      <Col span={4}>
        <MetricCard title="Темп" value="22.4°C" percent={50} color="#00ffcc" />
      </Col>
      <Col span={4}>
        <MetricCard
          title="Влажность"
          value="58%"
          percent={70}
          color="#ffaa00"
        />
      </Col>
      <Col span={4}>
        <MetricCard title="PM2.5" value="18" percent={40} color="#00ffcc" />
      </Col>
      <Col span={4}>
        <MetricCard title="VOC" value="340" percent={80} color="#ffaa00" />
      </Col>
      <Col span={4}>
        <MetricCard
          title="Давление"
          value="1013 hPa"
          percent={65}
          color="#00ffcc"
        />
      </Col>
    </Row>
  );
};

export default StatsCards;
