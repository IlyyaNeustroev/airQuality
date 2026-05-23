import { Space, Tag, Typography } from "antd";

const { Text } = Typography;

const ModelFeatures = () => {
  return (
    <div style={{ marginTop: 24 }}>
      <Text style={{ color: "#00eaff" }}>ПРИЗНАКИ МОДЕЛИ</Text>

      <div style={{ marginTop: 12 }}>
        <Space wrap>
          <Tag color="cyan">CO2</Tag>
          <Tag color="blue">Temperature</Tag>
          <Tag color="purple">Humidity</Tag>
          <Tag color="green">PM2.5</Tag>
          <Tag color="gold">VOC</Tag>
          <Tag color="lime">TimeOfDay</Tag>
          <Tag color="magenta">Occupancy</Tag>
        </Space>
      </div>
    </div>
  );
};

export default ModelFeatures;
