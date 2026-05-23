import { Row, Col, Button } from "antd";

const ModelActions = () => {
  return (
    <Row gutter={12} style={{ marginTop: 24 }}>
      <Col span={12}>
        <Button danger block>
          Переобучить
        </Button>
      </Col>

      <Col span={12}>
        <Button block>Экспорт</Button>
      </Col>
    </Row>
  );
};

export default ModelActions;
