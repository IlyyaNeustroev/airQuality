import { Row, Col, Button } from "antd";
import type { MlSettings } from "../../api";

interface Props {
  mlSettings: MlSettings;
  onRetrain: () => void;
  onExport: () => void;
}

const ModelActions = ({ onRetrain, onExport }: Props) => {
  return (
    <Row gutter={12} style={{ marginTop: 24 }}>
      <Col span={12}>
        <Button danger block onClick={onRetrain}>
          Переобучить
        </Button>
      </Col>

      <Col span={12}>
        <Button block onClick={onExport}>
          Экспорт
        </Button>
      </Col>
    </Row>
  );
};

export default ModelActions;