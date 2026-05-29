// src/pages/ControlPage.tsx
import { Row, Col, Card } from "antd";
import { useState, useEffect } from "react"; 
import GlobalControls from "../components/control/GlobalControls";
import ZoneCard from "../components/control/ZoneCard";
import ZoneSettings from "../components/control/ZoneSettings";
import { fetchControlState } from "../api";
import type { Zone } from "../components/control/ZoneCard";

// export default async function ControlPage() {
//   const data = await fetchControlState();
//   const zones: Zone[] = data.zones;

export default function ControlPage() {
  // используем хуки в реальном времени
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchControlState().then(data => {
      setZones(data.zones);
      setLoading(false);
    }).catch(e => {
      console.error("Ошибка /api/control:", e);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <div>Загрузка управления...</div>;

  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Управление вентиляцией</span>}
      className="custom-card"
    >
      <GlobalControls updateZones={(newZones) => setZones(newZones)} />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Row gutter={[16, 16]}>
            {zones.map((z) => (
              <Col span={12} key={z.id}>
                <ZoneCard zone={z} />
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={8}>
          <ZoneSettings updateZones={(newZones) => setZones(newZones)} />
        </Col>
      </Row>
    </Card>
  );
}