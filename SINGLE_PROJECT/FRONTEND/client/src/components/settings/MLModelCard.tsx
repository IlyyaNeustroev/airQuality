import { Card, Typography, Progress, Table, Space, Collapse, Tag } from "antd";
import ModelInfoCards from "./ModelInfoCards";
import ModelFeatures from "./ModelFeatures";
import ModelActions from "./ModelActions";

const { Title, Text } = Typography;

interface Props {
  modelInfo: ModelInfo;
  mlSettings: MlSettings;
  onChange: (ml: MlSettings) => void;
}

// Статические данные из MLflow (подставлены вручную)
const MOCK_METADATA = {
  version: "1.0",
  trained_at: "2026-06-02: 18:54:31",
  features: [
    "season", "weekday", "temp", "hum", "mq7", "mq135",
    "ky028_analog", "ky028_digital", "bmp_temp", "pressure",
    "altitude", "aht21_temp", "aht21_hum", "ens_iaq", "ens_tvoc", "ens_co2"
  ],
  best_params: {
    "clf__n_estimators": 120,
    "clf__min_samples_split": 2,
    "clf__min_samples_leaf": 2,
    "clf__max_features": "sqrt",
    "clf__max_depth": 10,
    "clf__bootstrap": true
  },
  train_rows: 843176,
  test_rows: 210794,
  train_accuracy: 0.9323308538193686,
  test_accuracy: 0.9303538051367686,
  train_f1_macro: 0.9076681161451852,
  test_f1_macro: 0.9056605302755936,
  data_hash: "1da23a0cc3fcad4d1b2327a13657e36ff43ef9a83dbb45292ac3c5de5b97399f"
};

const MOCK_EXPERIMENTS = [
  {
    timestamp: "2026-05-29T23:09:42.854997",
    rows: 1053970,
    best_params: {
      "clf__n_estimators": 120,
      "clf__min_samples_split": 2,
      "clf__min_samples_leaf": 2,
      "clf__max_features": "sqrt",
      "clf__max_depth": 10,
      "clf__bootstrap": true
    },
    train_accuracy: 0.9323308538193686,
    test_accuracy: 0.9303538051367686,
    train_f1_macro: 0.9076681161451852,
    test_f1_macro: 0.9056605302755936
  },
  {
    timestamp: "2026-05-30T12:29:20.354093",
    rows: 1053970,
    best_params: {
      "clf__n_estimators": 120,
      "clf__min_samples_split": 2,
      "clf__min_samples_leaf": 2,
      "clf__max_features": "sqrt",
      "clf__max_depth": 10,
      "clf__bootstrap": true
    },
    train_accuracy: 0.9323308538193686,
    test_accuracy: 0.9303538051367686,
    train_f1_macro: 0.9076681161451852,
    test_f1_macro: 0.9056605302755936
  },
  {
    timestamp: "2026-06-02T19:32:13.108203",
    rows: 1053970,
    best_params: {
      "clf__n_estimators": 120,
      "clf__min_samples_split": 2,
      "clf__min_samples_leaf": 2,
      "clf__max_features": "sqrt",
      "clf__max_depth": 10,
      "clf__bootstrap": true
    },
    train_accuracy: 0.9323308538193686,
    test_accuracy: 0.9303538051367686,
    train_f1_macro: 0.9076681161451852,
    test_f1_macro: 0.9056605302755936
  }
];

const MOCK_CLASSIFICATION_REPORT = {
  "0": { precision: 0.97, recall: 0.98, f1_score: 0.97, support: 7116 },
  "1": { precision: 0.92, recall: 0.93, f1_score: 0.92, support: 66015 },
  "2": { precision: 0.95, recall: 0.94, f1_score: 0.94, support: 117369 },
  "3": { precision: 0.86, recall: 0.89, f1_score: 0.88, support: 17337 },
  "4": { precision: 0.72, recall: 0.92, f1_score: 0.81, support: 2957 },
  accuracy: 0.93,
  "macro avg": { precision: 0.88, recall: 0.93, f1_score: 0.91, support: 210794 },
  "weighted avg": { precision: 0.93, recall: 0.93, f1_score: 0.93, support: 210794 }
};

const MLModelCard = ({ modelInfo, mlSettings, onChange }: Props) => {
  // Сравнение с предыдущим экспериментом
  const getMetricChange = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    const delta = current - previous;
    const pct = Math.abs(previous) > 0 ? (delta / previous) * 100 : 0;
    return { delta, pct };
  };

  const lastExperiment = MOCK_EXPERIMENTS[MOCK_EXPERIMENTS.length - 1];
  const previousExperiment = MOCK_EXPERIMENTS[MOCK_EXPERIMENTS.length - 2];

  const metricData = [
    { 
      metric: "Train Accuracy", 
      value: lastExperiment.train_accuracy, 
      previous: previousExperiment?.train_accuracy,
      color: "#00ffaa"
    },
    { 
      metric: "Test Accuracy", 
      value: lastExperiment.test_accuracy, 
      previous: previousExperiment?.test_accuracy,
      color: "#00ffaa"
    },
    { 
      metric: "Train F1 Macro", 
      value: lastExperiment.train_f1_macro, 
      previous: previousExperiment?.train_f1_macro,
      color: "#4dd0e1"
    },
    { 
      metric: "Test F1 Macro", 
      value: lastExperiment.test_f1_macro, 
      previous: previousExperiment?.test_f1_macro,
      color: "#4dd0e1"
    },
  ];

  const experimentsTableData = MOCK_EXPERIMENTS.map((exp, idx) => ({
    key: idx,
    version: exp.timestamp.slice(0, 19).replace("T", " "),
    rows: exp.rows.toLocaleString(),
    test_acc: exp.test_accuracy,
    test_f1: exp.test_f1_macro,
  }));

  return (
    <Card className="neon-card">
      {/* Верхняя часть */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={4} style={{ color: "#00eaff", margin: 0 }}>
            AirQualityPredictor
          </Title>
          <Text style={{ color: "#4dd0e1" }}>Версия {MOCK_METADATA.version}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="green">FAST_MODE</Tag>
            <Tag color="blue">{MOCK_METADATA.train_rows.toLocaleString()} строк</Tag>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: "#5fbbf1",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {(MOCK_METADATA.test_accuracy * 100).toFixed(2)}%
          </div>
          <Text style={{ color: "#00ffaa" }}>ТОЧНОСТЬ (TEST)</Text>
          <div
            style={{
              color: "#4dd0e1",
              fontSize: 20,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {MOCK_METADATA.test_f1_macro.toFixed(4)}
          </div>
          <Text style={{ color: "#4dd0e1" }}>F1 MACRO</Text>
        </div>
      </div>

      <Progress percent={93} showInfo={false} strokeColor="#00ffaa" />

      {/* Информация об обучении */}
      <div style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text style={{ color: "#888" }}>Обучено:</Text>
            <Text style={{ color: "#00eaff" }}>
              {new Date(MOCK_METADATA.trained_at).toLocaleString("ru-RU")}
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text style={{ color: "#888" }}>Train / Test:</Text>
            <Text style={{ color: "#00eaff" }}>
              {MOCK_METADATA.train_rows.toLocaleString()} / {MOCK_METADATA.test_rows.toLocaleString()}
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text style={{ color: "#888" }}>Data Hash:</Text>
            <Text style={{ color: "#4dd0e1", fontSize: 12 }}>
              {MOCK_METADATA.data_hash.slice(0, 16)}...
            </Text>
          </div>
        </Space>
      </div>

      {/* Признаки */}
      <div style={{ marginTop: 16 }}>
        <Text style={{ color: "#888", display: "block", marginBottom: 8 }}>
          Признаки ({MOCK_METADATA.features.length}):
        </Text>
        <Space wrap size="small">
          {MOCK_METADATA.features.map((feature) => (
            <Tag key={feature} style={{ color: "#730101", borderColor: "#00eaff" }}>
              {feature}
            </Tag>
          ))}
        </Space>
      </div>

      {/* История переобучения */}
      <Collapse
        style={{ marginTop: 20 }}
        ghost
        defaultActiveKeys={["1", "2"]}
        items={[
          {
            key: "1",
            label: <Text style={{ color: "#00eaff" }}>📊 Метрики обучения</Text>,
            children: (
              <Table
                dataSource={metricData}
                columns={[
                  {
                    title: "Метрика",
                    dataIndex: "metric",
                    key: "metric",
                    render: (text: string) => <Text strong style={{ color: "#fff" }}>{text}</Text>,
                  },
                  {
                    title: "Значение",
                    key: "value",
                    render: (_: any, record: any) => {
                      const change = getMetricChange(record.value, record.previous);
                      const accuracyPct = (record.value * 100).toFixed(3);
                      
                      if (!change) {
                        return <Text strong style={{ color: record.color }}>{accuracyPct}%</Text>;
                      }
                      
                      const color = change.delta >= 0 ? "#00ffaa" : "#ff4d4d";
                      const sign = change.delta >= 0 ? "+" : "";
                      
                      return (
                        <Space>
                          <Text strong style={{ color: record.color }}>{accuracyPct}%</Text>
                          <Tag color={color} style={{ fontSize: 12 }}>
                            {sign}{change.delta.toFixed(4)} ({sign}{change.pct.toFixed(2)}%)
                          </Tag>
                        </Space>
                      );
                    },
                  },
                ]}
                pagination={false}
                size="small"
                showHeader={false}
                rowKey="metric"
              />
            ),
          },
          {
            key: "2",
            label: <Text style={{ color: "#00eaff" }}>🔧 Гиперпараметры (RandomizedSearchCV)</Text>,
            children: (
              <Card size="small" style={{ background: "rgba(0, 20, 40, 0.5)", border: "1px solid #00eaff" }}>
                <Space direction="vertical" style={{ width: "100%" }} size="small">
                  {Object.entries(MOCK_METADATA.best_params).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                      <Text style={{ color: "#4dd0e1" }}>{key}</Text>
                      <Text strong style={{ color: "#00ffaa", fontFamily: "monospace" }}>{String(value)}</Text>
                    </div>
                  ))}
                </Space>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #333" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text style={{ color: "#888" }}>Best CV Score:</Text>
                    <Text strong style={{ color: "#00ffaa" }}>0.9040</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <Text style={{ color: "#888" }}>Итераций (n_iter):</Text>
                    <Text strong style={{ color: "#00eaff" }}>3 (FAST_MODE)</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <Text style={{ color: "#888" }}>Кросс-валидация (cv):</Text>
                    <Text strong style={{ color: "#00eaff" }}>2 фолда</Text>
                  </div>
                </div>
              </Card>
            ),
          },
          {
            key: "3",
            label: <Text style={{ color: "#00eaff" }}>📈 Классификация по классам (0–5)</Text>,
            children: (
              <Table
                dataSource={Object.entries(MOCK_CLASSIFICATION_REPORT)
                  .filter(([key]) => !["accuracy", "macro avg", "weighted avg"].includes(key))
                  .map(([key, value]: [string, any]) => ({
                    key,
                    class: key === "0" ? "0: Отлично" : 
                          key === "1" ? "1: Хорошо" :
                          key === "2" ? "2: Удовл." :
                          key === "3" ? "3: Плохо" :
                          key === "4" ? "4: Очень плохо" : "5: АВАРИЯ!",
                    precision: value.precision,
                    recall: value.recall,
                    f1: value.f1_score,
                    support: value.support.toLocaleString(),
                  }))}
                columns={[
                  { title: "Класс", dataIndex: "class", key: "class", 
                    render: (text: string, record: any) => (
                      <Tag color={record.key === "4" ? "red" : record.key === "3" ? "orange" : "green"}>
                        {text}
                      </Tag>
                    ) 
                  },
                  { 
                    title: "Precision", 
                    dataIndex: "precision", 
                    key: "precision",
                    render: (v: number) => <Text style={{ color: "#4dd0e1" }}>{v.toFixed(2)}</Text>
                  },
                  { 
                    title: "Recall", 
                    dataIndex: "recall", 
                    key: "recall",
                    render: (v: number) => <Text style={{ color: "#4dd0e1" }}>{v.toFixed(2)}</Text>
                  },
                  { 
                    title: "F1-Score", 
                    dataIndex: "f1", 
                    key: "f1",
                    render: (v: number) => <Text strong style={{ color: "#00ffaa" }}>{v.toFixed(2)}</Text>
                  },
                  { 
                    title: "Support", 
                    dataIndex: "support", 
                    key: "support",
                    render: (v: number) => <Text style={{ color: "#888" }}>{v}</Text>
                  },
                ]}
                pagination={false}
                size="small"
                showHeader={true}
              />
            ),
          },
          {
            key: "4",
            label: <Text style={{ color: "#00eaff" }}>📜 История экспериментов (3)</Text>,
            children: (
              <Table
                dataSource={experimentsTableData}
                columns={[
                  { 
                    title: "Дата/Время", 
                    dataIndex: "version", 
                    key: "version",
                    render: (text: string) => <Text style={{ color: "#00eaff" }}>{text}</Text>
                  },
                  { 
                    title: "Строк", 
                    dataIndex: "rows", 
                    key: "rows",
                    render: (text: string) => <Text style={{ color: "#888" }}>{text}</Text>
                  },
                  { 
                    title: "Test Accuracy", 
                    dataIndex: "test_acc", 
                    key: "test_acc",
                    render: (v: number) => <Text strong style={{ color: "#00ffaa" }}>{(v * 100).toFixed(3)}%</Text>
                  },
                  { 
                    title: "Test F1 Macro", 
                    dataIndex: "test_f1", 
                    key: "test_f1",
                    render: (v: number) => <Text strong style={{ color: "#4dd0e1" }}>{v.toFixed(4)}</Text>
                  },
                ]}
                pagination={false}
                size="small"
                showHeader={true}
              />
            ),
          },
        ]}
      />

      <ModelActions
        mlSettings={mlSettings}
        onRetrain={() => {
          console.log("Переобучение модели...");
        }}
        onExport={() => {
          console.log("Экспорт модели...");
        }}
      />
    </Card>
  );
};

export default MLModelCard;