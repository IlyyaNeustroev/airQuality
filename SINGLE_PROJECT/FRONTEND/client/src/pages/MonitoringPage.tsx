import SensorsSummary from "../components/monitoring/SensorsSummary";
import SensorsTable from "../components/monitoring/SensorsTable";

const MonitoringPage = () => {
  return (
    <>
      <SensorsSummary />
      <div style={{ marginTop: 20 }}>
        <SensorsTable />
      </div>
    </>
  );
};

export default MonitoringPage;
