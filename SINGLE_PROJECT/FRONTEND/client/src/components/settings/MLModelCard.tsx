import { Card, Typography, Progress } from "antd";
import ModelInfoCards from "./ModelInfoCards";
import ModelFeatures from "./ModelFeatures";
import ModelActions from "./ModelActions";

import { ModelInfo, MlSettings } from "../../api";

const { Title, Text } = Typography;

interface Props {
  modelInfo: ModelInfo;
  mlSettings: MlSettings;
  onChange: (ml: MlSettings) => void;
}

const MLModelCard = ({ modelInfo, mlSettings, onChange }: Props) => {
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
            {modelInfo.name}
          </Title>
          <Text style={{ color: "#4dd0e1" }}>Версия {modelInfo.version}</Text>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: "#00ffaa",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {modelInfo.accuracy.toFixed(1)}%
          </div>
          <Text style={{ color: "#00ffaa" }}>ТОЧНОСТЬ</Text>
        </div>
      </div>

      <Progress
        percent={98}
        showInfo={false}
        strokeColor="#00ffaa"
      />

      <ModelInfoCards
        train_date={modelInfo.train_date}
        dataset_size={modelInfo.dataset_size}
      />

      <ModelFeatures features={modelInfo.features} />

      <ModelActions
        mlSettings={mlSettings}
        onRetrain={() => {
          // TODO: вызвать переобучение модели (новый эндпоинт /api/settings/retrain)
          console.log("Переобучение модели...");
        }}
        onExport={() => {
          // TODO: экспорт модели (GET /api/settings/export)
          console.log("Экспорт модели...");
        }}
      />
    </Card>
  );
};

export default MLModelCard;