// src/components/monitoring/SensorsSummary.tsx
import { Card, Row, Col } from "antd";
import { fetchMonitoringData } from "../../api";
import { useEffect, useState } from "react";

const SensorsSummary = () => {
  const [summary, setSummary] = useState<{
    total: number;
    online: number;
    warning: number;
    critical: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData()
      .then(data => {
        setSummary(data.summary);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки статуса датчиков:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Row gutter={16}>
        <Col span={6}>
          <Card>Загрузка...</Card>
        </Col>
        <Col span={6}>
          <Card>Загрузка...</Card>
        </Col>
        <Col span={6}>
          <Card>Загрузка...</Card>
        </Col>
        <Col span={6}>
          <Card>Загрузка...</Card>
        </Col>
      </Row>
    );

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "#00eaff", fontSize: "24px" }}>{summary?.total || 0}</div>
            <div style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}>
              Всего
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "green", fontSize: "24px" }}>{summary?.online || 0}</div>
            <div style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}>
              Онлайн
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "orange", fontSize: "24px" }}>{summary?.warning || 0}</div>
            <div style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}>
              Внимание
            </div>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div style={{ color: "red", fontSize: "24px" }}>{summary?.critical || 0}</div>
            <div style={{ color: "white", fontSize: "20px", paddingTop: "3px" }}>
              Критично
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SensorsSummary;