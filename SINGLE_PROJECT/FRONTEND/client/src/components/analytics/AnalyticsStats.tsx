import { Row, Col } from "antd";
import AnalyticsStatCard from "./AnalyticsStatCard";

const AnalyticsStats = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <AnalyticsStatCard
          title="ПОТРЕБЛЕНИЕ СЕГОДНЯ"
          value="81.0 кВт·ч"
          subtitle="↓ 8% vs вчера"
          color="#00eaff"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="СЕЙЧАС"
          value="4.2 кВт"
          subtitle="Норма: 5.0 кВт"
          color="#00ffaa"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="ЗА МЕСЯЦ"
          value="1,240 кВт·ч"
          subtitle="Бюджет: 1500"
          color="#ffaa00"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="ЭКОНОМИЯ"
          value="↑ 18%"
          subtitle="vs прошлый месяц"
          color="#00ffaa"
        />
      </Col>
    </Row>
  );
};

export default AnalyticsStats;
