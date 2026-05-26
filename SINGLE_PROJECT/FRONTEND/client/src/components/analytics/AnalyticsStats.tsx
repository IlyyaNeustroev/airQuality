// src/components/analytics/AnalyticsStats.tsx
import { Row, Col } from "antd";
import AnalyticsStatCard from "./AnalyticsStatCard";
import { useEffect, useState } from "react";
import { fetchAnalyticsData } from "../../api";

// типы для данных аналитики
interface AnalyticsData {
  today_kwh: number;        // кВт·ч за сегодня
  today_delta_pct: number;  // % относительно вчера
  now_kw: number;           // мощность сейчас, кВт
  month_kwh: number;        // кВт·ч за месяц
  budget_kwh: number;       // бюджет за месяц
  save_pct: number;         // % экономии vs прошлый месяц
}

export default function AnalyticsStats() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAnalyticsData();
        setData(result);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Неизвестная ошибка загрузки";
        setError(message);
        console.error("Ошибка загрузки статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Загрузка аналитики...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Ошибка: {error}</div>;
  }

  // чтобы TS не ругался на `data` — делаем fallback
  const d = data || {
    today_kwh: 81.0,
    today_delta_pct: 8,
    now_kw: 4.2,
    month_kwh: 1240,
    budget_kwh: 1500,
    save_pct: 18,
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <AnalyticsStatCard
          title="ПОТРЕБЛЕНИЕ СЕГОДНЯ"
          value={`${d.today_kwh.toFixed(1)} кВт·ч`}
          subtitle={`↓ ${Math.abs(d.today_delta_pct)}% vs вчера`}
          color="#00eaff"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="СЕЙЧАС"
          value={`${d.now_kw.toFixed(1)} кВт`}
          subtitle="Норма: 5.0 кВт"
          color="#00ffaa"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="ЗА МЕСЯЦ"
          value={`${d.month_kwh.toFixed(0)} кВт·ч`}
          subtitle={`Бюджет: ${d.budget_kwh}`}
          color="#ffaa00"
        />
      </Col>

      <Col span={6}>
        <AnalyticsStatCard
          title="ЭКОНОМИЯ"
          value={`↑ ${d.save_pct}%`}
          subtitle="vs прошлый месяц"
          color="#00ffaa"
        />
      </Col>
    </Row>
  );
}