import { Card, Row, Col } from "antd";

const SensorsSummary = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "#00eaff", fontSize: "24px" }}>12</div>
            <div
              style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}
            >
              Всего
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "green", fontSize: "24px" }}>7</div>
            <div
              style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}
            >
              Онлайн
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "orange", fontSize: "24px" }}>3</div>
            <div
              style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}
            >
              Внимание
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "red", fontSize: "24px" }}>1</div>
            <div
              style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}
            >
              Критично
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SensorsSummary;
