import { Row, Col, Card } from "antd";
import GlobalControls from "../components/control/GlobalControls";
import ZoneCard from "../components/control/ZoneCard";
import ZoneSettings from "../components/control/ZoneSettings";
import type { Zone } from "../components/control/ZoneCard";

const zones: Zone[] = [
  { id: "1", name: "Конференц-зал", power: 85, temp: 25.1, status: "on" },
  { id: "2", name: "Открытый офис", power: 68, temp: 23.4, status: "auto" },
  { id: "3", name: "Серверная", power: 100, temp: 19.2, status: "on" },
  { id: "4", name: "Приёмная", power: 30, temp: 22.1, status: "auto" },
  { id: "5", name: "Лаборатория", power: 70, temp: 22.8, status: "on" },
  { id: "6", name: "Столовая", power: 50, temp: 23.7, status: "auto" },
];

const ControlPage = () => {
  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Управление вентиляцией</span>}
      className="custom-card"
    >
      <GlobalControls />

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
          <ZoneSettings />
        </Col>
      </Row>
    </Card>
  );
};

export default ControlPage;
