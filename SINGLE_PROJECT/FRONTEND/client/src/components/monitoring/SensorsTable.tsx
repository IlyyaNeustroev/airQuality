// src/components/monitoring/SensorsTable.tsx
import { Table, Tag } from "antd";
import { fetchMonitoringData } from "../../api";
import { useEffect, useState } from "react";

interface Sensor {
  id: string;
  room: string;
  co2: number;
  temp: number;
  hum: number;
  aqi: number;
  status: "online" | "warning" | "critical";
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Помещение",
    dataIndex: "room",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "CO2",
    dataIndex: "co2",
    render: (v: number) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Темп",
    dataIndex: "temp",
    render: (v: number) => <div style={{ color: "white" }}>{v.toFixed(1)}</div>,
  },
  {
    title: "Влажность",
    dataIndex: "hum",
    render: (v: number) => <div style={{ color: "white" }}>{v.toFixed(1)}</div>,
  },
  {
    title: "AQI",
    dataIndex: "aqi",
    render: (v: number) => (
      <Tag color={v > 80 ? "red" : v > 60 ? "orange" : "green"}>{v}</Tag>
    ),
  },
];

const SensorsTable = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData()
      .then(data => {
        setSensors(data.sensors);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных датчиков:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка таблицы датчиков...</div>;

  return (
    <Table
      columns={columns}
      dataSource={sensors}
      rowKey="id"
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
      }}
    />
  );
};

export default SensorsTable;