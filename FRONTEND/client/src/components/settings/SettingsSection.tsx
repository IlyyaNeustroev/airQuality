import { Row, Col } from "antd";
import MLModelCard from "./MLModelCard";
import ModelSettings from "./ModelSettings";

const SettingsSection = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <MLModelCard />
      </Col>

      <Col span={12}>
        <ModelSettings />
      </Col>
    </Row>
  );
};

export default SettingsSection;
