import { Card, Space, Button } from "antd";
import LogsFilters from "../components/history/LogsFilters";
import LogsTable from "../components/history/LogsTable";

const HistoryPage = () => {
  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>История и логи</span>}
      className="custom-card"
    >
      <LogsFilters />

      <div style={{ marginTop: 16 }}>
        <LogsTable />
      </div>

      <Space style={{ marginTop: 16 }}>
        <Button>Экспорт CSV</Button>
        <Button>Экспорт JSON</Button>
        <Button>Экспорт PDF</Button>
      </Space>
    </Card>
  );
};

export default HistoryPage;
