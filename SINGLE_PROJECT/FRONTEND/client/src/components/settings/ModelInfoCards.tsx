import { Row, Col, Card, Typography } from "antd";

const { Text } = Typography;

const ModelInfoCards = () => {
  return (
    <Row gutter={12} style={{ marginTop: 24 }}>
      <Col span={12}>
        <Card size="small" className="inner-card">
          <Text style={{ color: "#00eaff" }}>ОБУЧЕНА НА</Text>

          <div style={{ marginTop: 8, color: "#8be9fd" }}>2026-04-10</div>
        </Card>
      </Col>

      <Col span={12}>
        <Card size="small" className="inner-card">
          <Text style={{ color: "#00eaff" }}>ДАТАСЕТ</Text>

          <div style={{ marginTop: 8, color: "#8be9fd" }}>128,400 записей</div>
        </Card>
      </Col>
    </Row>
  );
};

export default ModelInfoCards;
