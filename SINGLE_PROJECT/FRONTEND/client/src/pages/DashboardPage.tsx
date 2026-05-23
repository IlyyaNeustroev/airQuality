import { Row, Col } from "antd";
import StatsCards from "../components/dashboard/StatsCards";
import FloorsStatus from "../components/dashboard/FloorsStatus";
import EventsList from "../components/dashboard/EventsList";

const DashboardPage = () => {
  return (
    <>
      <StatsCards />

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <FloorsStatus />
        </Col>
        <Col span={12}>
          <EventsList />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
