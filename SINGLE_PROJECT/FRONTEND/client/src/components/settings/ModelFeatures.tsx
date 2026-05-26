import { Space, Tag, Typography } from "antd";

const { Text } = Typography;

interface Props {
  features: string[];
}

const ModelFeatures = ({ features }: Props) => {
  return (
    <div style={{ marginTop: 24 }}>
      <Text style={{ color: "#00eaff" }}>ПРИЗНАКИ МОДЕЛИ</Text>
      <div style={{ marginTop: 12 }}>
        <Space wrap>
          {features.map((f, i) => (
            <Tag key={i} color={["cyan", "blue", "purple", "green", "gold", "lime", "magenta"][i % 7]}>
              {f}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default ModelFeatures;