import { Row, Col } from "antd";
import AnalyticsStatCard from "./AnalyticsStatCard";
import { fetchAnalyticsData } from "../../api";

export default async function AnalyticsStats() {
  try {
    const data = await fetchAnalyticsData();

    return (
      <Row gutter={16}>
        <Col span={6}>
          <AnalyticsStatCard
            title="ПОТРЕБЛЕНИЕ СЕГОДНЯ"
            value={`${data.today_kwh.toFixed(1)} кВт·ч`}
            subtitle={`↓ ${Math.abs(data.today_delta_pct)}% vs вчера`}
            color="#00eaff"
          />
        </Col>

        <Col span={6}>
          <AnalyticsStatCard
            title="СЕЙЧАС"
            value={`${data.now_kw.toFixed(1)} кВт`}
            subtitle="Норма: 5.0 кВт"
            color="#00ffaa"
          />
        </Col>

        <Col span={6}>
          <AnalyticsStatCard
            title="ЗА МЕСЯЦ"
            value={`${data.month_kwh.toFixed(0)} кВт·ч`}
            subtitle={`Бюджет: ${data.budget_kwh}`}
            color="#ffaa00"
          />
        </Col>

        <Col span={6}>
          <AnalyticsStatCard
            title="ЭКОНОМИЯ"
            value={`↑ ${data.save_pct}%`}
            subtitle="vs прошлый месяц"
            color="#00ffaa"
          />
        </Col>
      </Row>
    );
  } catch (error) {
    console.error("Ошибка загрузки статистики:", error);
    return <div>Загрузка...</div>;
  }
}