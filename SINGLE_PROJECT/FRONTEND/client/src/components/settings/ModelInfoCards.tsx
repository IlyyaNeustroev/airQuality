import { Row, Col, Card, Typography } from "antd";

const { Text } = Typography;

interface Props {
  train_date: string;
  dataset_size: number;
}

const ModelInfoCards = ({ train_date, dataset_size }: Props) => {
  return (
    <Row gutter={12} style={{ marginTop: 24 }}>
      <Col span={12}>
        <Card size="small" className="inner-card">
          <Text style={{ color: "#00eaff" }}>ОБУЧЕНА НА</Text>
          <div style={{ marginTop: 8, color: "#8be9fd" }}>{train_date}</div>
        </Card>
      </Col>

      <Col span={12}>
        <Card size="small" className="inner-card">
          <Text style={{ color: "#00eaff" }}>ДАТАСЕТ</Text>
          <div style={{ marginTop: 8, color: "#8be9fd" }}>
            {dataset_size.toLocaleString()} записей
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ModelInfoCards;