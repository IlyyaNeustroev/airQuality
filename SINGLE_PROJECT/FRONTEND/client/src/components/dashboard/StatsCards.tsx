// src/components/dashboard/StatsCards.tsx
import { Row, Col, Typography } from "antd";
import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import { fetchRealtimeData } from "../../api";

interface SensorData {
  ens_co2?: number;
  temp?: number;
  hum?: number;
  tvoc?: number;
  pressure?: number;
}

interface RealtimeResponse {
  sensors?: {
    room_1?: SensorData;
  };
}

export default function StatsCards() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchRealtimeData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
        console.error("Ошибка загрузки данных:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography type="danger">Ошибка: {error}</Typography>;

  const room = data?.sensors?.room_1;

  // Вспомогательная функция для безопасного форматирования чисел
  const formatNumber = (value: number | undefined | null, decimals: number = 1, defaultValue: string): string => {
    if (value == null || isNaN(Number(value))) {
      return defaultValue;
    }
    return Number(value).toFixed(decimals);
  };

  return (
    <Row gutter={16}>
      <Col span={4}>
        <MetricCard
          title="CO2"
          value={`${room?.ens_co2 ?? 412} ppm`}
          percent={60}
          color="#00ffcc"
        />
      </Col>
      <Col span={4}>
        <MetricCard
          title="Темп"
          value={`${formatNumber(room?.temp, 1, '22.4')}°C`}
          percent={50}
          color="#00ffcc"
        />
      </Col>
      <Col span={4}>
        <MetricCard
          title="Влажность"
          value={`${room?.hum ?? 58}%`}
          percent={70}
          color="#ffaa00"
        />
      </Col>
      <Col span={4}>
        <MetricCard title="PM2.5" value="18" percent={40} color="#00ffcc" />
      </Col>
      <Col span={4}>
        <MetricCard
          title="VOC"
          value={`${room?.tvoc ?? 340}`}
          percent={80}
          color="#ffaa00"
        />
      </Col>
      <Col span={4}>
        <MetricCard
          title="Давление"
          value={`${formatNumber(room?.pressure, 0, '1013')} hPa`}
          percent={65}
          color="#00ffcc"
        />
      </Col>
    </Row>
  );
}
