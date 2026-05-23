import { Card, Typography, Progress } from "antd";
import ModelInfoCards from "./ModelInfoCards";
import ModelFeatures from "./ModelFeatures";
import ModelActions from "./ModelActions";

const { Title, Text } = Typography;

const MLModelCard = () => {
  return (
    <Card className="neon-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#00eaff", margin: 0 }}>
            AeroML v2.4
          </Title>

          <Text style={{ color: "#4dd0e1" }}>Версия 2.4.1</Text>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: "#00ffaa",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            97.8%
          </div>

          <Text style={{ color: "#00ffaa" }}>ТОЧНОСТЬ</Text>
        </div>
      </div>

      <Progress percent={98} showInfo={false} strokeColor="#00ffaa" />

      <ModelInfoCards />

      <ModelFeatures />

      <ModelActions />
    </Card>
  );
};

export default MLModelCard;
