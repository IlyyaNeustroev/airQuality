import { Row, Col } from "antd";
import MLModelCard from "./MLModelCard";
import ModelSettings from "./ModelSettings";

import type { MlSettings } from "../../api";

interface Props {
  mlSettings: MlSettings;
  modelInfo: {
    name: string;
    version: string;
    accuracy: number;
    train_date: string;
    dataset_size: number;
    features: string[];
  };
  onChange: (ml: MlSettings) => void;
}

const SettingsSection = ({ mlSettings, modelInfo, onChange }: Props) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <MLModelCard
          modelInfo={modelInfo}
          mlSettings={mlSettings}
          onChange={onChange}
        />
      </Col>

      <Col span={12}>
        <ModelSettings
          mlSettings={mlSettings}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default SettingsSection;